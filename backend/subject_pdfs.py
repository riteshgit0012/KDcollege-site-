import os
import json
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads", "pdfs")
META_FILE  = os.path.join(os.path.dirname(__file__), "uploads", "subject_pdfs_meta.json")

os.makedirs(UPLOAD_DIR, exist_ok=True)


def load_meta():
    if not os.path.exists(META_FILE):
        return []
    with open(META_FILE, "r") as f:
        return json.load(f)


def save_meta(data):
    with open(META_FILE, "w") as f:
        json.dump(data, f, indent=2)


@router.get("/pdfs")
def get_pdfs(department: Optional[str] = None, subject: Optional[str] = None):
    meta = load_meta()
    if department:
        meta = [m for m in meta if m["department"].lower() == department.lower()]
    if subject:
        meta = [m for m in meta if m["subject"].lower() == subject.lower()]
    return meta


@router.post("/pdfs/add")
async def add_pdf(
    department: str        = Form(...),
    subject:    str        = Form(...),
    class_name: str        = Form(...),
    token:      str        = Form(...),
    pdf_file:   UploadFile = File(...),
):
    if token != "admin-logged-in":
        raise HTTPException(status_code=403, detail="Unauthorized")

    allowed = {"application/pdf"}
    if pdf_file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    filename = f"{uuid.uuid4().hex}.pdf"
    filepath = os.path.join(UPLOAD_DIR, filename)

    content = await pdf_file.read()
    if len(content) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 20MB.")

    with open(filepath, "wb") as f:
        f.write(content)

    pdf_id = uuid.uuid4().hex
    meta = load_meta()
    meta.append({
        "_id":           pdf_id,
        "department":    department,
        "subject":       subject,
        "class_name":    class_name,
        "filename":      filename,
        "original_name": pdf_file.filename,
        "url":           f"/uploads/pdfs/{filename}",
    })
    save_meta(meta)

    return {"success": True, "id": pdf_id}


@router.delete("/pdfs/delete/{pdf_id}")
def delete_pdf(pdf_id: str, token: str):
    if token != "admin-logged-in":
        raise HTTPException(status_code=403, detail="Unauthorized")

    meta = load_meta()
    pdf  = next((p for p in meta if p["_id"] == pdf_id), None)

    if pdf:
        filepath = os.path.join(UPLOAD_DIR, pdf["filename"])
        if os.path.exists(filepath):
            os.remove(filepath)

    meta = [p for p in meta if p["_id"] != pdf_id]
    save_meta(meta)

    return {"success": True}
