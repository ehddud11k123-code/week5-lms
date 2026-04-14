import os
import hmac
import hashlib
from fastapi import APIRouter, Request, HTTPException
from database import get_supabase

router = APIRouter()

POLAR_WEBHOOK_SECRET = os.environ.get("POLAR_WEBHOOK_SECRET", "")
POLAR_PRODUCT_ID = os.environ.get("POLAR_PRODUCT_ID", "")


def verify_polar_signature(payload: bytes, signature: str) -> bool:
    expected = hmac.new(
        POLAR_WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)


@router.post("/webhook")
async def polar_webhook(request: Request):
    payload = await request.body()
    signature = request.headers.get("webhook-signature", "")

    if not verify_polar_signature(payload, signature):
        raise HTTPException(status_code=403, detail="Invalid signature")

    event = await request.json()

    if event.get("type") != "order.created":
        return {"status": "ignored"}

    order = event["data"]

    if order.get("product_id") != POLAR_PRODUCT_ID:
        return {"status": "ignored"}

    customer_email = order["customer"]["email"]
    polar_order_id = order["id"]
    amount = order["amount"]

    db = get_supabase()

    user_result = db.table("users").select("id").eq("email", customer_email).execute()
    if not user_result.data:
        new_user = db.table("users").insert({"email": customer_email}).execute()
        user_id = new_user.data[0]["id"]
    else:
        user_id = user_result.data[0]["id"]

    existing = db.table("purchases").select("id").eq("polar_order_id", polar_order_id).execute()
    if not existing.data:
        db.table("purchases").insert({
            "user_id": user_id,
            "polar_order_id": polar_order_id,
            "amount": amount,
        }).execute()

    return {"status": "ok"}


@router.get("/checkout-url")
def get_checkout_url():
    product_id = os.environ.get("POLAR_PRODUCT_ID", "")
    return {
        "url": f"https://buy.polar.sh/{product_id}"
    }
