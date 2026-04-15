from datetime import datetime
from fastapi import APIRouter, Depends
from typing import List
from models import ProgressUpdate, ProgressResponse
from auth import verify_jwt
from database import get_supabase

router = APIRouter()


@router.get("/", response_model=List[ProgressResponse])
def get_progress(payload: dict = Depends(verify_jwt)):
    db = get_supabase()
    result = db.table("progress").select("*").eq("user_id", payload["sub"]).execute()
    return [ProgressResponse(section_id=r["section_id"], completed=r["completed"]) for r in result.data]


@router.post("/", response_model=ProgressResponse)
def update_progress(body: ProgressUpdate, payload: dict = Depends(verify_jwt)):
    db = get_supabase()
    result = db.table("progress").upsert({
        "user_id": payload["sub"],
        "section_id": body.section_id,
        "completed": body.completed,
        "updated_at": datetime.utcnow().isoformat(),
    }, on_conflict="user_id,section_id").execute()
    row = result.data[0]
    return ProgressResponse(section_id=row["section_id"], completed=row["completed"])
