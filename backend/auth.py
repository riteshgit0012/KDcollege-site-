from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.post("/login")
def login():
    return JSONResponse(
        status_code=501,
        content={"success": False, "message": "Login not implemented yet."}
    )
