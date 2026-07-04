import os
import json
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads", "gallery")
META_FILE = os.path.join(os.path.dirname(__file__), "uploads", "gallery_meta.json")

os.makedirs(UPLOAD_DIR, exist_ok=True)


def load_meta():
    if not os.path.exists(META_FILE):
        return []
    with open(META_FILE, "r") as f:
        return json.load(f)


def save_meta(data):
    with open(META_FILE, "w") as f:
        json.dump(data, f, indent=2)


@router.get("/gallery/images")

def get_images():
    return load_meta()


@router.post("/gallery/upload")
async def upload_image(
    label: str = Form(...),
    token: str = Form(...),
    file: UploadFile = File(...),
):
    if token != "admin-logged-in":
        raise HTTPException(status_code=403, detail="Unauthorized")

    allowed = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only image files allowed.")

    ext = file.filename.rsplit(".", 1)[-1].lower()
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB.")

    with open(filepath, "wb") as f:
        f.write(content)

    meta = load_meta()
    meta.append({"filename": filename, "label": label, "url": f"/uploads/gallery/{filename}"})
    save_meta(meta)

    return {"success": True, "filename": filename, "label": label}


@router.delete("/gallery/delete/{filename}")
def delete_image(filename: str, token: str):
    if token != "admin-logged-in":
        raise HTTPException(status_code=403, detail="Unauthorized")

    filepath = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(filepath):
        os.remove(filepath)

    meta = load_meta()
    meta = [m for m in meta if m["filename"] != filename]
    save_meta(meta)

    return {"success": True}
