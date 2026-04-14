from pydantic import BaseModel
from typing import Optional


class GoogleAuthRequest(BaseModel):
    code: str
    redirect_uri: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str]
    avatar_url: Optional[str]
    has_purchased: bool


class ProgressUpdate(BaseModel):
    section_id: str
    completed: bool


class ProgressResponse(BaseModel):
    section_id: str
    completed: bool
