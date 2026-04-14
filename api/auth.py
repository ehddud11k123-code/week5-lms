import os
import httpx
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from models import GoogleAuthRequest, TokenResponse, UserResponse
from database import get_supabase

router = APIRouter()
security = HTTPBearer()

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24 * 7  # 7일

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


def create_jwt(user_id: str, email: str, has_purchased: bool) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "purchased": has_purchased,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRE_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_jwt(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/google", response_model=TokenResponse)
async def google_auth(body: GoogleAuthRequest):
    async with httpx.AsyncClient() as client:
        token_res = await client.post(GOOGLE_TOKEN_URL, data={
            "code": body.code,
            "client_id": os.environ["GOOGLE_CLIENT_ID"],
            "client_secret": os.environ["GOOGLE_CLIENT_SECRET"],
            "redirect_uri": body.redirect_uri,
            "grant_type": "authorization_code",
        })
        if token_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Google token exchange failed")
        google_token = token_res.json()["access_token"]

        user_res = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {google_token}"},
        )
        if user_res.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        google_user = user_res.json()

    db = get_supabase()
    email = google_user["email"]

    result = db.table("users").upsert({
        "email": email,
        "name": google_user.get("name"),
        "avatar_url": google_user.get("picture"),
    }, on_conflict="email").execute()
    user = result.data[0]

    purchase = db.table("purchases").select("id").eq("user_id", user["id"]).execute()
    has_purchased = len(purchase.data) > 0

    token = create_jwt(user["id"], email, has_purchased)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
def get_me(payload: dict = Depends(verify_jwt)):
    db = get_supabase()
    user_id = payload["sub"]

    user = db.table("users").select("*").eq("id", user_id).single().execute().data
    purchase = db.table("purchases").select("id").eq("user_id", user_id).execute()
    has_purchased = len(purchase.data) > 0

    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user.get("name"),
        avatar_url=user.get("avatar_url"),
        has_purchased=has_purchased,
    )
