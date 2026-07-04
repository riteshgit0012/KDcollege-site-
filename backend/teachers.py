import os
import json
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads", "teachers")
META_FILE  = os.path.join(os.path.dirname(__file__), "uploads", "teachers_meta.json")

os.makedirs(UPLOAD_DIR, exist_ok=True)


def load_meta():
    if not os.path.exists(META_FILE):
        return []
    with open(META_FILE, "r") as f:
        return json.load(f)


def save_meta(data):
    with open(META_FILE, "w") as f:
        json.dump(data, f, indent=2)


@router.get("/teachers")
def get_teachers():
    return load_meta()


@router.post("/teachers/add")
async def add_teacher(
    name:       str        = Form(...),
    department: str        = Form(...),
    token:      str        = Form(...),
    photo:      UploadFile = File(...),
):
    if token != "admin-logged-in":
        raise HTTPException(status_code=403, detail="Unauthorized")

    allowed = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if photo.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only image files allowed.")

    ext      = photo.filename.rsplit(".", 1)[-1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    content = await photo.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB.")

    with open(filepath, "wb") as f:
        f.write(content)

    teacher_id = uuid.uuid4().hex
    meta = load_meta()
    meta.append({
        "_id":        teacher_id,
        "name":       name,
        "department": department,
        "photo":      f"/uploads/teachers/{filename}",
        "filename":   filename,
    })
    save_meta(meta)

    return {"success": True, "id": teacher_id}


@router.delete("/teachers/delete/{teacher_id}")
def delete_teacher(teacher_id: str, token: str):
    if token != "admin-logged-in":
        raise HTTPException(status_code=403, detail="Unauthorized")

    meta = load_meta()
    teacher = next((t for t in meta if t["_id"] == teacher_id), None)

    if teacher:
        filepath = os.path.join(UPLOAD_DIR, teacher["filename"])
        if os.path.exists(filepath):
            os.remove(filepath)

    meta = [t for t in meta if t["_id"] != teacher_id]
    save_meta(meta)

    return {"success": True}
