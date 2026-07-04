from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

ADMIN_ID = "admin"
ADMIN_PASS = "Ritesh@002500"


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/admin/login")
def admin_login(body: LoginRequest):
    if body.username == ADMIN_ID and body.password == ADMIN_PASS:
        return {"success": True, "token": "admin-logged-in"}
    raise HTTPException(status_code=401, detail="Invalid credentials")
