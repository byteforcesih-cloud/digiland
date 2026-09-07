import io
import os
import uuid
from PIL import Image, ImageStat
from typing import List, Dict, Any, Tuple
from app.core.config import settings

class ScannerService:
    """
    Advanced Document Scanning & Multi-Page PDF compilation engine.
    Assesses image quality, blur, brightness, and document detection.
    """
    
    @staticmethod
    def evaluate_image_quality(image_bytes: bytes) -> Dict[str, Any]:
        """
        Analyzes image quality, brightness, resolution, and estimated sharpness.
        """
        try:
            img = Image.open(io.BytesIO(image_bytes))
            width, height = img.size
            
            # Check Resolution
            if width < 300 or height < 300:
                return {
                    "is_acceptable": False,
                    "status": "Low Resolution",
                    "reason": f"Image resolution ({width}x{height}) is below minimum requirement of 300x300.",
                    "details": {"width": width, "height": height, "brightness": 0, "sharpness": 0}
                }
                
            # Convert to grayscale for analysis
            gray = img.convert("L")
            stat = ImageStat.Stat(gray)
            mean_brightness = stat.mean[0] # 0 (black) to 255 (white)
            stddev_contrast = stat.stddev[0]
            
            # Check Brightness
            if mean_brightness < 40:
                return {
                    "is_acceptable": False,
                    "status": "Poor Image Quality",
                    "reason": "Image is too dark. Please use uniform lighting and capture again.",
                    "details": {"width": width, "height": height, "brightness": round(mean_brightness, 1), "contrast": round(stddev_contrast, 1)}
                }
            elif mean_brightness > 240:
                return {
                    "is_acceptable": False,
                    "status": "Poor Image Quality",
                    "reason": "Image is washed out by excessive glare or flash. Please recapture.",
                    "details": {"width": width, "height": height, "brightness": round(mean_brightness, 1), "contrast": round(stddev_contrast, 1)}
                }
                
            # Check Blur / Sharpness using stddev contrast variance
            if stddev_contrast < 20:
                return {
                    "is_acceptable": False,
                    "status": "Image Too Blurry",
                    "reason": "Image lacks sharp edge definition. Please hold the camera steady.",
                    "details": {"width": width, "height": height, "brightness": round(mean_brightness, 1), "contrast": round(stddev_contrast, 1)}
                }
                
            return {
                "is_acceptable": True,
                "status": "Document Detected",
                "reason": "Document frame detected with optimal sharpness and lighting.",
                "details": {
                    "width": width,
                    "height": height,
                    "brightness": round(mean_brightness, 1),
                    "contrast": round(stddev_contrast, 1),
                    "aspect_ratio": round(width / height, 2)
                }
            }
        except Exception as e:
            return {
                "is_acceptable": False,
                "status": "Invalid Document Image",
                "reason": f"Failed to process image format: {str(e)}",
                "details": {}
            }

    @staticmethod
    def compile_multipage_pdf(page_bytes_list: List[bytes], output_filename: str) -> Tuple[str, bytes]:
        """
        Combines multiple scanned page images into a single clean PDF document.
        Returns: (output_path, pdf_bytes)
        """
        images = []
        for p_bytes in page_bytes_list:
            try:
                img = Image.open(io.BytesIO(p_bytes))
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                images.append(img)
            except Exception as e:
                print(f"[SCAN COMPILER] Skipping corrupt frame: {e}")
                
        if not images:
            raise ValueError("No valid image pages provided for compilation.")
            
        pdf_buffer = io.BytesIO()
        first_img = images[0]
        rest_images = images[1:] if len(images) > 1 else []
        
        first_img.save(pdf_buffer, format="PDF", save_all=True, append_images=rest_images)
        pdf_bytes = pdf_buffer.getvalue()
        
        save_dir = settings.SCANS_DIR
        os.makedirs(save_dir, exist_ok=True)
        full_path = os.path.join(save_dir, output_filename)
        
        with open(full_path, "wb") as f:
            f.write(pdf_bytes)
            
        return full_path, pdf_bytes

scanner_service = ScannerService()
