import os
import base64
import hashlib
from typing import Tuple
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.core.config import settings

class DocumentEncryptionService:
    """
    AES-256-GCM Authenticated Encryption for sensitive document files stored on disk.
    Key is kept in environment configuration; never stored in code or database.
    """
    
    def __init__(self):
        # Derive 32-byte key from configured secret
        raw_key = settings.AES_ENCRYPTION_KEY.encode('utf-8')
        self._key = hashlib.sha256(raw_key).digest() # 32 bytes (256 bits)
        self.aesgcm = AESGCM(self._key)
        
    def encrypt_bytes(self, data: bytes) -> Tuple[bytes, str]:
        """
        Encrypts raw binary data using AES-256-GCM with a fresh 12-byte random nonce.
        Returns: (encrypted_bytes_with_tag, nonce_base64)
        """
        nonce = os.urandom(12) # 96-bit standard nonce for GCM
        encrypted_data = self.aesgcm.encrypt(nonce, data, None)
        nonce_b64 = base64.b64encode(nonce).decode('utf-8')
        return encrypted_data, nonce_b64
        
    def decrypt_bytes(self, encrypted_data: bytes, nonce_b64: str) -> bytes:
        """
        Decrypts AES-256-GCM ciphertext using the original nonce.
        Raises InvalidTag if ciphertext or tag was tampered with.
        """
        nonce = base64.b64decode(nonce_b64.encode('utf-8'))
        decrypted_data = self.aesgcm.decrypt(nonce, encrypted_data, None)
        return decrypted_data
        
    def encrypt_and_save_file(self, file_bytes: bytes, target_dir: str, filename: str) -> Tuple[str, str, int]:
        """
        Encrypts file bytes and writes to disk with .enc extension.
        Returns: (full_file_path, nonce_base64, encrypted_file_size)
        """
        os.makedirs(target_dir, exist_ok=True)
        enc_filename = f"{filename}.enc"
        full_path = os.path.join(target_dir, enc_filename)
        
        encrypted_bytes, nonce_b64 = self.encrypt_bytes(file_bytes)
        with open(full_path, "wb") as f:
            f.write(encrypted_bytes)
            
        return full_path, nonce_b64, len(encrypted_bytes)
        
    def read_and_decrypt_file(self, file_path: str, nonce_b64: str) -> bytes:
        """
        Reads encrypted file from disk and returns decrypted bytes in memory.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Encrypted document not found at {file_path}")
            
        with open(file_path, "rb") as f:
            encrypted_bytes = f.read()
            
        return self.decrypt_bytes(encrypted_bytes, nonce_b64)

encryption_service = DocumentEncryptionService()
