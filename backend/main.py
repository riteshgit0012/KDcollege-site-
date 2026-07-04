# uvicorn main:app --reload --port 5001

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contact import router as contact_router
from auth import router as auth_router
from admin_auth import router as admin_auth_router
from gallery_upload import router as gallery_router
from teachers import router as teachers_router
from subject_pdfs import router as pdfs_router

app = FastAPI(title="KD College Backend")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173", "http://localhost:5174"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://kdpubliccollegesite.vercel.app", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images as static files
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(contact_router, prefix="/api")
app.include_router(auth_router, prefix="/api/auth")
app.include_router(admin_auth_router, prefix="/api")
app.include_router(gallery_router, prefix="/api")
app.include_router(teachers_router, prefix="/api")
app.include_router(pdfs_router, prefix="/api")


@app.get("/")
def health_check():
    return {"status": "KD College Backend running"}
