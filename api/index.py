import os
import sys
sys.path.insert(0, os.path.dirname(__file__))
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Week5 LMS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from auth import router as auth_router
from payment import router as payment_router
from progress import router as progress_router

app.include_router(auth_router, prefix="/api/auth")
app.include_router(payment_router, prefix="/api/payment")
app.include_router(progress_router, prefix="/api/progress")


@app.get("/api/health")
def health():
    keys = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "JWT_SECRET", "SUPABASE_URL", "SUPABASE_SERVICE_KEY"]
    return {"status": "ok", "env": {k: "SET" if os.environ.get(k) else "MISSING" for k in keys}}
