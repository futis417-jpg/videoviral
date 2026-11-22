"""
Genera automáticamente `qa_contact_sheet.png` (cuadrícula 3x3 de 9 capturas)
para que la IA inspeccione visualmente el vídeo antes de entregarlo.
"""
from PIL import Image, ImageDraw

def build_contact_sheet(png_frames, out_path="qa_contact_sheet.png"):
    if not png_frames:
        return
    tw, th = 360, 640
    cols, rows = 3, 3
    sheet = Image.new("RGB", (tw * cols, th * rows), (12, 16, 28))
    draw = ImageDraw.Draw(sheet)
    for idx, (label, pil_img) in enumerate(png_frames[:9]):
        r, c = divmod(idx, cols)
        thumb = pil_img.resize((tw, th), Image.Resampling.LANCZOS)
        sheet.paste(thumb, (c * tw, r * th))
        draw.rectangle([c * tw + 8, r * th + 8, c * tw + 130, r * th + 38], fill=(15, 23, 42))
        draw.text((c * tw + 16, r * th + 15), label, fill=(0, 245, 212))
    sheet.save(out_path)
    print(f"🔍 QA Contact Sheet guardado en: {out_path} (REVÍSALO antes de entregar el vídeo!)")
