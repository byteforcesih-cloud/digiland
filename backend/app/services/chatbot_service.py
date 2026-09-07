import re
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.document import Document
from app.models.dispute import DisputeCase
from app.models.storage import StorageFile, UserStorageQuota
from app.schemas.chatbot import ChatQueryResponse, FlowchartStep, ActionButton, ChatbotAction

class ChatbotService:
    """
    Real-Time Context-Aware Multilingual AI Land Records Assistant for DigiLand.
    Features:
    - Structured Markdown presentation (Headings, Numbered Procedures, Bullet Points, Highlight Cards)
    - Full multilingual synchronization across 6 Indian Languages (EN, TA, HI, TE, KN, ML)
    - Real-time authorized database querying (Pending deeds, verified records, encrypted storage vault)
    - In-chat voice & language synchronization
    - Domain guardrails with polite out-of-scope guidance
    - Procedural step-by-step interactive flowcharts
    """

    DISCLAIMER = "Disclaimer: DigiLand AI Assistant provides informational guidance only. Official legal validity rests solely with authorized Revenue/Registration Government Officers."

    SUPPORTED_LANGUAGES = {
        "en": "English",
        "ta": "Tamil",
        "hi": "Hindi",
        "te": "Telugu",
        "kn": "Kannada",
        "ml": "Malayalam"
    }

    OUT_OF_SCOPE_PATTERNS = [
        r"\b(cricket|football|movie|actor|actress|cinema|recipe|cook|biryani|weather|climate|joke|song|sing|capital of|president of|prime minister of|stock price|bitcoin|crypto|games|gaming|play)\b"
    ]

    @classmethod
    def get_response(
        cls,
        query: str,
        language: str = "en",
        context_path: Optional[str] = None,
        current_user: Optional[User] = None,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        q_raw = query.strip()
        q = q_raw.lower()
        lang = language if language in cls.SUPPORTED_LANGUAGES else "en"

        # -------------------------------------------------------------
        # 1. LANGUAGE SWITCHING INTENT
        # -------------------------------------------------------------
        lang_switch = cls._detect_language_switch(q_raw)
        if lang_switch:
            target_code, target_label = lang_switch
            replies = {
                "ta": "### 🌐 மொழி மாற்றம் செய்யப்பட்டது\n\nவலைத்தள மற்றும் குரல் மொழி **தமிழுக்கு (Tamil)** மாற்றப்பட்டது.\n\n• **கிடைக்கும் சேவைகள்**: நில ஆவண பதிவேற்றம், பட்டா / சிட்டா சரிபார்ப்பு, சர்வே எண் தேடல் மற்றும் நில புகார்கள்.\n\nநான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
                "hi": "### 🌐 भाषा बदल दी गई है\n\nवेबसाइट और AI आवाज़ की भाषा बदलकर **हिन्दी (Hindi)** कर दी गई है।\n\n• **उपलब्ध सेवाएँ**: भूमि दस्तावेज़ अपलोड, पट्टा / चिट्टा सत्यापन, खसरा/सर्वे खोज और शिकायतें।\n\nमैं आपकी कैसे सहायता कर सकता हूँ?",
                "te": "### 🌐 భాష మార్చబడింది\n\nవెబ్‌సైట్ మరియు AI వాయిస్ **తెలుగు (Telugu)** కు మార్చబడింది.\n\nనేను మీకు ఎలా సహాయపడగలను?",
                "kn": "### 🌐 ಭಾಷೆ ಬದಲಾಗಿದೆ\n\nವೆಬ್‌ಸೈಟ್ ಮತ್ತು AI ಧ್ವನಿ **ಕನ್ನಡ (Kannada)** ಕ್ಕೆ ಬದಲಾಗಿದೆ.\n\nನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
                "ml": "### 🌐 ഭാഷ മാറ്റി\n\nവെബ്സൈറ്റും AI ശബ്ദവും **മലയാളത്തിലേക്ക് (Malayalam)** മാറ്റി.\n\nഞാൻ എങ്ങനെ സഹായിക്കണം?",
                "en": "### 🌐 Language Updated\n\nWebsite and AI Voice language has been updated to **English**.\n\n• **Available Services**: Land Records Search, Patta / Chitta Verification, Camera Scanner, and Secure Storage.\n\nHow can I assist you with DigiLand services today?"
            }
            return {
                "reply": replies.get(target_code, replies["en"]),
                "action": {
                    "type": "CHANGE_LANGUAGE",
                    "language": target_code,
                    "language_label": target_label
                },
                "suggested_actions": ["How to search land by Survey No?", "How to upload land document?", "Open Land Search"],
                "flowchart": None,
                "is_out_of_scope": False,
                "disclaimer": cls.DISCLAIMER
            }

        # -------------------------------------------------------------
        # 2. OUT-OF-SCOPE GUARDRAIL CHECK
        # -------------------------------------------------------------
        if any(re.search(pat, q) for pat in cls.OUT_OF_SCOPE_PATTERNS):
            out_replies = {
                "en": (
                    "### ⚠️ Out of Scope Inquiry\n\n"
                    "Sorry, I am unable to provide a reliable answer to that question because it is outside the information and services currently available to me in DigiLand.\n\n"
                    "**I can assist you with:**\n"
                    "1. Cadastral Land Search & Survey Number Lookup\n"
                    "2. Patta, Chitta & Title Deed OCR Parsing\n"
                    "3. AI Document Review & Verification Queue status\n"
                    "4. Encrypted 1GB Personal Storage Vault\n"
                    "5. Boundary Grievance & Land Dispute Redressal"
                ),
                "ta": (
                    "### ⚠️ வரம்பிற்கு அப்பாற்பட்ட கேள்வி\n\n"
                    "மன்னிக்கவும், நான் **டிஜிலாண்ட் நில ஆவண சேவைகளுக்கு** மட்டுமே உதவ முடியும்.\n\n"
                    "**நான் உதவக்கூடிய சேவைகள்:**\n"
                    "1. சர்வே எண் மற்றும் பட்டா தேடல்\n"
                    "2. நில ஆவண ஸ்கேனிங் & OCR விவரங்கள்\n"
                    "3. ஆவண சரிபார்ப்பு & AI மதிப்பாய்வு\n"
                    "4. பாதுகாப்பான சேமிப்பகம் (1GB Vault)\n"
                    "5. நில தகராறு மற்றும் புகார்கள்"
                ),
                "hi": (
                    "### ⚠️ कार्यक्षेत्र से बाहर का प्रश्न\n\n"
                    "क्षमा करें, मैं केवल **डिजीलँड भूमि और राजस्व अभिलेख सेवाओं** में सहायता कर सकता हूँ।\n\n"
                    "**उपलब्ध सहायता विषय:**\n"
                    "1. खसरा/सर्वे नंबर से भूमि खोज\n"
                    "2. पट्टा/चिट्टा दस्तावेज़ सत्यापन और OCR\n"
                    "3. AI दस्तावेज़ समीक्षा और अधिकारी सत्यापन स्थिति\n"
                    "4. सुरक्षित 1GB स्टोरेज वॉल्ट\n"
                    "5. भूमि विवाद और शिकायत निवारण"
                )
            }
            return {
                "reply": out_replies.get(lang, out_replies["en"]),
                "suggested_actions": ["How to search land by Survey No?", "How to upload deed?", "Open Scan Document", "Open My Documents"],
                "flowchart": None,
                "action": None,
                "is_out_of_scope": True,
                "disclaimer": cls.DISCLAIMER
            }

        # -------------------------------------------------------------
        # 3. REAL-TIME AUTHORIZED DATABASE QUERIES
        # -------------------------------------------------------------
        if current_user and db:
            # Document status / summary query
            if re.search(r"\b(how many|what is|check|show|count|my)\b.*\b(pending|status|verified|rejected|document|paper|upload)\b", q):
                total_docs = db.query(Document).filter(Document.user_id == current_user.id).count()
                pending_docs = db.query(Document).filter(Document.user_id == current_user.id, Document.status.in_(["PENDING", "VERIFICATION_REQUIRED", "DUPLICATE_SUSPECTED"])).count()
                verified_docs = db.query(Document).filter(Document.user_id == current_user.id, Document.status == "VERIFIED").count()
                
                if lang == "ta":
                    reply = (
                        f"### 📊 உங்கள் நில ஆவணங்களின் நேரடி நிலை\n\n"
                        f"| விவரம் | எண்ணிக்கை |\n"
                        f"| :--- | :--- |\n"
                        f"| **மொத்த ஆவணங்கள்** | **{total_docs}** |\n"
                        f"| **சரிபார்ப்பில் உள்ளவை (Pending Verification)** | **{pending_docs}** |\n"
                        f"| **சரிபார்க்கப்பட்டவை (Verified)** | **{verified_docs}** |\n\n"
                        f"> 💡 **குறிப்பு**: சரிபார்க்கப்பட்ட ஆவணங்களுக்கான பாதுகாக்கப்பட்ட சான்றிதழை 'My Documents' பகுதியில் பதிவிறக்கம் செய்யலாம்."
                    )
                elif lang == "hi":
                    reply = (
                        f"### 📊 आपके भूमि दस्तावेज़ों की स्थिति\n\n"
                        f"| विवरण | संख्या |\n"
                        f"| :--- | :--- |\n"
                        f"| **कुल अपलोड किए गए दस्तावेज़** | **{total_docs}** |\n"
                        f"| **सत्यापन लंबित (Pending Verification)** | **{pending_docs}** |\n"
                        f"| **सत्यापित (Verified)** | **{verified_docs}** |\n\n"
                        f"> 💡 **सुझाव**: सत्यापित दस्तावेज़ों का पासवर्ड-संरक्षित प्रमाणपत्र 'My Documents' से डाउनलोड करें।"
                    )
                else:
                    reply = (
                        f"### 📊 Your Live Document Summary\n\n"
                        f"| Metric | Count |\n"
                        f"| :--- | :--- |\n"
                        f"| **Total Uploaded Records** | **{total_docs}** |\n"
                        f"| **Pending Verification** | **{pending_docs}** |\n"
                        f"| **Successfully Verified Deeds** | **{verified_docs}** |\n\n"
                        f"> 💡 **Action**: You can view all records and AI inspection reports directly in **My Documents**."
                    )
                return {
                    "reply": reply,
                    "suggested_actions": ["Open My Documents", "Download Certificate", "Upload New Deed"],
                    "action": {"type": "NAVIGATE", "path": "/citizen/documents", "label": "My Documents"},
                    "live_data": {"total": total_docs, "pending": pending_docs, "verified": verified_docs},
                    "flowchart": None,
                    "is_out_of_scope": False,
                    "disclaimer": cls.DISCLAIMER
                }

            # Storage quota query
            if re.search(r"\b(storage|quota|space|vault|mb|gb|used)\b", q):
                quota = db.query(UserStorageQuota).filter(UserStorageQuota.user_id == current_user.id).first()
                used_mb = (quota.used_bytes / (1024 * 1024)) if quota else 0.0
                total_quota = quota.total_quota_mb if quota else 1024
                pct = (used_mb / total_quota * 100) if total_quota else 0

                if lang == "ta":
                    reply = (
                        f"### 🔒 பாதுகாப்பான பெட்டக சேமிப்பக நிலை (1GB Secure Vault)\n\n"
                        f"• **மொத்த ஒதுக்கீடு**: {total_quota} MB (1 GB)\n"
                        f"• **பயன்படுத்தப்பட்டது**: {used_mb:.2f} MB ({pct:.1f}%)\n"
                        f"• **பாதுகாப்பு**: AES-256 GCM மிலிட்டரி-கிரேடு குறியாக்கம்\n\n"
                        f"> 💡 உங்கள் பட்டா மற்றும் பத்திரங்களை பாதுகாப்பாக பதிவேற்ற 'My Secure Storage' செல்லவும்."
                    )
                else:
                    reply = (
                        f"### 🔒 My Secure Storage Vault Status\n\n"
                        f"• **Total Allocation**: {total_quota} MB (1.0 GB Free Quota)\n"
                        f"• **Used Space**: {used_mb:.2f} MB ({pct:.1f}% consumed)\n"
                        f"• **Encryption Standard**: Client-side AES-256 GCM with nonce integrity.\n\n"
                        f"> 💡 All uploaded original land titles are stored tamper-proof and strictly private."
                    )
                return {
                    "reply": reply,
                    "suggested_actions": ["Open My Secure Storage", "Upload Land Deeds to Vault"],
                    "action": {"type": "NAVIGATE", "path": "/citizen/storage", "label": "My Secure Storage"},
                    "live_data": {"used_mb": used_mb, "total_mb": total_quota, "percentage": pct},
                    "flowchart": None,
                    "is_out_of_scope": False,
                    "disclaimer": cls.DISCLAIMER
                }

            # Officer verification queue
            if current_user.role in ("GOVERNMENT_OFFICER", "ADMIN") and re.search(r"\b(queue|officer|assigned|to verify|verification queue)\b", q):
                pending_all = db.query(Document).filter(Document.status.in_(["PENDING", "VERIFICATION_REQUIRED", "DUPLICATE_SUSPECTED"])).count()
                disputes_pending = db.query(DisputeCase).filter(DisputeCase.status.in_(["Submitted", "Under Review", "Evidence Review"])).count()
                reply = (
                    f"### 🏛️ Revenue Officer Operational Queue\n\n"
                    f"• **Pending Land Document Verifications**: **{pending_all}** deeds\n"
                    f"• **Active Land Boundary Grievances**: **{disputes_pending}** cases\n"
                    f"• **Mandatory AI Review**: Enabled for all verification queue items."
                )
                return {
                    "reply": reply,
                    "suggested_actions": ["Open Verification Queue", "Open Duplicate Detection", "Open Officer Disputes"],
                    "action": {"type": "NAVIGATE", "path": "/officer/verification", "label": "Document Verification"},
                    "flowchart": None,
                    "is_out_of_scope": False,
                    "disclaimer": cls.DISCLAIMER
                }

        # -------------------------------------------------------------
        # 4. EXPLICIT APPLICATION NAVIGATION INTENTS
        # -------------------------------------------------------------
        nav_action = cls._detect_navigation_intent(q)
        if nav_action:
            return {
                "reply": f"### 🚀 Navigation Triggered\n\nOpening **{nav_action['label']}** module...",
                "suggested_actions": ["What should I do on this page?", "How does this feature work?"],
                "action": nav_action,
                "flowchart": None,
                "is_out_of_scope": False,
                "disclaimer": cls.DISCLAIMER
            }

        # -------------------------------------------------------------
        # 5. CONTEXT-AWARE INQUIRIES ("What should I do next?")
        # -------------------------------------------------------------
        if re.search(r"\b(what should i do|what next|next step|how do i use this|help me here|guide me)\b", q) and context_path:
            return cls._handle_context_assistance(context_path, lang)

        # -------------------------------------------------------------
        # 6. DOMAIN SPECIFIC INQUIRIES & PROCEDURAL FLOWCHARTS
        # -------------------------------------------------------------
        # Patta / Chitta / Land Terminology explanation
        if "patta" in q or "chitta" in q or "pattadar" in q or "பட்டா" in q or "சிட்டா" in q or "பத்திரம்" in q or "पट्टा" in q or "चिट्टा" in q:
            if lang == "ta":
                reply = (
                    "### 📜 பட்டா மற்றும் சிட்டா விளக்கம்\n\n"
                    "**பட்டா (Patta)** என்பது வருவாய்த் துறையால் (Tahsildar) வழங்கப்படும் அதிகாரப்பூர்வ நில உரிமை ஆவணம் ஆகும்.\n\n"
                    "**இதில் அடங்கியுள்ள முக்கிய விவரங்கள்:**\n"
                    "• **பட்டா எண்** மற்றும் உரிமையாளர் பெயர்\n"
                    "• **மாவட்டம், தாலுகா, வருவாய் கிராமம்**\n"
                    "• **சர்வே எண் மற்றும் உட்பிரிவு எண் (Subdivision)**\n"
                    "• **நிலத்தின் வகைப்பாடு (நஞ்சை/புஞ்சை) & பரப்பளவு**\n\n"
                    "> 💡 டிஜிலாண்டில் பட்டா பதிவேற்றும் போது AI தானாகவே இந்த 17 விவரங்களையும் பிரித்தெடுக்கிறது."
                )
            elif lang == "hi":
                reply = (
                    "### 📜 पट्टा और चिट्टा की जानकारी\n\n"
                    "**पट्टा (Patta)** राजस्व विभाग द्वारा जारी कानूनी भूमि स्वामित्व का आधिकारिक दस्तावेज़ है।\n\n"
                    "**प्रमुख विवरण:**\n"
                    "• **पट्टा संख्या** और भू-स्वामी का नाम\n"
                    "• **जिला, तहसील और ग्राम**\n"
                    "• **खसरा / सर्वे संख्या** और उप-विभाजन\n"
                    "• **भूमि का क्षेत्रफल और वर्गीकरण**\n\n"
                    "> 💡 डिजीलँड में अपलोड करने पर AI इन विवरणों को तुरंत डिजिटाइज़ करता है।"
                )
            else:
                reply = (
                    "### 📜 Patta & Land Title Overview\n\n"
                    "A **Patta** is an official revenue title record issued by the Tahsildar / Revenue Department confirming lawful ownership of a land parcel.\n\n"
                    "**Key Particulars Contained in a Patta:**\n"
                    "• **Patta Number & Owner Name**\n"
                    "• **Jurisdiction**: State, District, Taluk, and Village\n"
                    "• **Cadastral Identifiers**: Survey Number & Subdivision\n"
                    "• **Extent & Area**: Dimensions in Sq.Ft / Cents / Acres\n\n"
                    "> 💡 In DigiLand, uploaded Patta deeds undergo automatic OCR extraction, AI verification, and fraud detection before Tahsildar approval."
                )
            return {
                "reply": reply,
                "suggested_actions": ["Search Land by Patta", "Upload Patta Document", "How does AI Review work?"],
                "flowchart": [
                    FlowchartStep(step=1, title="Upload or Scan Patta", description="Upload digital PDF or capture physical deed via Camera Scanner.", action_btn=ActionButton(label="Open Scanner", path="/citizen/scan")),
                    FlowchartStep(step=2, title="AI Extraction & Review", description="Extract Patta No, Survey No, and boundaries with confidence scores."),
                    FlowchartStep(step=3, title="Officer Verification", description="Revenue Tahsildar inspects schedule and grants final approval.")
                ],
                "action": {"type": "NAVIGATE", "path": "/citizen/scan", "label": "Scan Document"},
                "is_out_of_scope": False,
                "disclaimer": cls.DISCLAIMER
            }

        # Password Protected PDF Download
        if "password" in q or "protected pdf" in q or "unlock" in q:
            reply = (
                "### 🔐 Password-Protected Certificate Unlock\n\n"
                "Downloaded official Land Record Certificates are encrypted with **AES-128 / PDF Standard Encryption** for privacy.\n\n"
                "**Password Formula:**\n"
                "`[Survey Number without slashes] + [Owner First Name in UPPERCASE]`\n\n"
                "**Example:**\n"
                "• Survey Number: `142/3A` $\\to$ `1423A`\n"
                "• Owner Name: `Ramasamy Subramanian` $\\to$ `RAMASAMY`\n"
                "• **Resulting PDF Password**: `1423ARAMASAMY`"
            )
            return {
                "reply": reply,
                "flowchart": [
                    FlowchartStep(step=1, title="Locate Survey Number", description="Remove spaces/slashes from Survey No (e.g. '142/3A' → '1423A')."),
                    FlowchartStep(step=2, title="Locate Owner First Name", description="Take first name in UPPERCASE (e.g. 'Ramasamy' → 'RAMASAMY')."),
                    FlowchartStep(step=3, title="Enter Unlock Password", description="Combine together: '1423ARAMASAMY'.")
                ],
                "suggested_actions": ["Open My Documents", "Download Certificate"],
                "action": {"type": "NAVIGATE", "path": "/citizen/documents", "label": "My Documents"},
                "is_out_of_scope": False,
                "disclaimer": cls.DISCLAIMER
            }

        # AI Review for Documents
        if "ai review" in q or "review document" in q or "ai review pending" in q:
            reply = (
                "### 🤖 AI Document Review Intelligence\n\n"
                "DigiLand provides an end-to-end automated **AI Document Review** for every uploaded title deed:\n\n"
                "1. **Document Classification**: Verifies deed type (Patta, Chitta, Sale Deed, EC).\n"
                "2. **17-Field Land Schedule**: Extracts Survey No, Patta, Owner, Boundaries, and Land Area.\n"
                "3. **Duplicate Conflict Analysis**: Flags cross-registry parcel overlap and dual registration attempts.\n"
                "4. **Digital Forensics & Tamper Scoring**: Analyzes image integrity and metadata anomalies.\n"
                "5. **Verification Queue Compulsory Status**: Officers review full AI findings before issuing approvals."
            )
            return {
                "reply": reply,
                "suggested_actions": ["Open My Documents", "Open Land Search", "How to scan deed?"],
                "flowchart": [
                    FlowchartStep(step=1, title="Upload Document", description="Upload deed or scan pages via multi-page camera."),
                    FlowchartStep(step=2, title="AI Review Engine", description="Runs OCR parsing, duplicate check, and tamper scoring."),
                    FlowchartStep(step=3, title="Officer Verdict", description="Tahsildar reviews AI findings and issues digital approval.")
                ],
                "action": {"type": "NAVIGATE", "path": "/citizen/documents", "label": "My Documents"},
                "is_out_of_scope": False,
                "disclaimer": cls.DISCLAIMER
            }

        # Mock Aadhaar Identity Verification
        if "aadhaar" in q or "kyc" in q or "verify identity" in q or "identity verification" in q:
            reply = (
                "### 🆔 Mock Aadhaar Identity Verification\n\n"
                "DigiLand includes a **Mock Aadhaar Identity Verification System** for simulated government KYC:\n\n"
                "1. **Synthetic Profiles**: Test with pre-seeded demo Aadhaar accounts.\n"
                "2. **Simulated OTP**: Receive an instant 6-digit SMS verification code.\n"
                "3. **Direct Role Access**: Citizens access all land upload, search, and storage vault features directly."
            )
            return {
                "reply": reply,
                "flowchart": [
                    FlowchartStep(step=1, title="Open Identity Verification", description="Navigate to Mock Aadhaar KYC portal.", action_btn=ActionButton(label="Open Verification", path="/citizen/identity-verification")),
                    FlowchartStep(step=2, title="Enter Mock Aadhaar Number", description="Enter 12-digit demo Aadhaar or select a synthetic profile."),
                    FlowchartStep(step=3, title="Enter OTP Code", description="Enter 6-digit verification code to complete verification.")
                ],
                "suggested_actions": ["Open Identity Verification", "Open Land Search"],
                "action": {"type": "NAVIGATE", "path": "/citizen/identity-verification", "label": "Identity Verification"},
                "is_out_of_scope": False,
                "disclaimer": cls.DISCLAIMER
            }

        # Upload / Property deed addition
        if re.search(r"\b(how|steps|procedure|process|where|guide)\b.*\b(upload|add|submit|property paper|land document|deed)\b", q) or "add property" in q or "upload document" in q:
            return cls._flowchart_upload_document(lang)

        # Land Search / Finding land
        if re.search(r"\b(how|steps|procedure|process|where|find)\b.*\b(search|find|locate|property|survey|khasra)\b", q) or "find land" in q or "search property" in q:
            return cls._flowchart_land_search(lang)

        # Scan Document / Camera / OCR
        if re.search(r"\b(how|steps|procedure|process)\b.*\b(scan|camera|compile|ocr|get details|extract)\b", q) or "camera scan" in q:
            return cls._flowchart_scan_document(lang)

        # Land Dispute / Grievance filing
        if re.search(r"\b(how|steps|procedure|process)\b.*\b(dispute|complaint|grievance|encroachment|boundary)\b", q) or "file dispute" in q:
            return cls._flowchart_land_dispute(lang)

        # GIS Cadastral Map
        if re.search(r"\b(gis|map|parcel|polygon|coordinates|zoning)\b", q):
            return cls._flowchart_gis_map(lang)

        # Blockchain Integrity & Tamper Check
        if re.search(r"\b(blockchain|integrity|tamper|audit chain|hash|sha-256)\b", q):
            return cls._flowchart_integrity(lang)

        # -------------------------------------------------------------
        # 7. NATURAL DOMAIN EXPLANATIONS / FALLBACK
        # -------------------------------------------------------------
        if lang == "ta":
            general_reply = (
                "### 🌾 வணக்கம்! நான் உங்கள் டிஜிலாண்ட் AI உதவியாளர்\n\n"
                "நான் உங்களுக்கு பின்வரும் சேவைகளில் வழிகாட்ட முடியும்:\n\n"
                "1. **நில ஆவண தேடல்**: மாநிலம் $\\to$ மாவட்டம் $\\to$ தாலுகா $\\to$ கிராமம் மூலம் சர்வே எண் தேடுதல்.\n"
                "2. **ஆவண ஸ்கேன் & பதிவேற்றம்**: கேமரா மூலம் படமெடுத்து 17 முக்கிய நில விவரங்களை பிரித்தெடுத்தல்.\n"
                "3. **AI ஆவண மதிப்பாய்வு**: ஆவண உண்மைத்தன்மை, போலி நகல் கண்டறிதல் மற்றும் சரிபார்ப்பு.\n"
                "4. **குரல் வழி உரையாடல்**: மைக் பொத்தானை அழுத்தி நேரடியாக பேசி தகவல்களை பெறலாம்."
            )
        elif lang == "hi":
            general_reply = (
                "### 🌾 नमस्ते! मैं आपका डिजीलँड AI सहायक हूँ\n\n"
                "मैं निम्नलिखित सेवाओं में आपकी सहायता कर सकता हूँ:\n\n"
                "1. **भूमि अभिलेख खोज**: राज्य $\\to$ जिला $\\to$ तहसील $\\to$ ग्राम द्वारा खसरा/सर्वे संख्या खोजना।\n"
                "2. **दस्तावेज़ स्कैन और अपलोड**: कैमरा स्कैनर से 17 महत्वपूर्ण भूमि विवरण निकालना।\n"
                "3. **AI दस्तावेज़ समीक्षा**: प्रामाणिकता, डुप्लीकेट पहचान और सत्यापन स्थिति।\n"
                "4. **वॉयस इनपुट**: माइक बटन दबाकर बोलकर प्रश्न पूछें।"
            )
        else:
            general_reply = (
                "### 🌾 Welcome to DigiLand AI Assistant\n\n"
                "I am your official conversational guide for land administration and digital deeds:\n\n"
                "1. **Cadastral Land Search**: Query land parcels using State $\\to$ District $\\to$ Taluk $\\to$ Village hierarchy.\n"
                "2. **Scan & Digitize Deeds**: Capture multi-page deeds and extract 17 structured land parameters.\n"
                "3. **AI Document Review**: Automated integrity analysis, duplicate overlap detection, and officer verification.\n"
                "4. **Voice Interaction**: Click the microphone icon to speak naturally in your preferred language."
            )

        return {
            "reply": general_reply,
            "suggested_actions": [
                "How to upload a land document?",
                "How to search land by Survey No?",
                "How does AI Review work?",
                "Open GIS Parcel Map"
            ],
            "flowchart": None,
            "action": None,
            "is_out_of_scope": False,
            "disclaimer": cls.DISCLAIMER
        }

    # =========================================================================
    # HELPER METHODS & FLOWCHART BUILDERS
    # =========================================================================

    @classmethod
    def _detect_language_switch(cls, text: str) -> Optional[tuple]:
        t = text.lower()
        if "tamil" in t or "தமிழ்" in t or "தமிழுக்கு" in t:
            return ("ta", "Tamil")
        if "hindi" in t or "हिन्दी" in t or "हिंदी" in t:
            return ("hi", "Hindi")
        if "telugu" in t or "తెలుగు" in t:
            return ("te", "Telugu")
        if "kannada" in t or "ಕನ್ನಡ" in t:
            return ("kn", "Kannada")
        if "malayalam" in t or "മലയാളം" in t:
            return ("ml", "Malayalam")
        if "english" in t or "ஆங்கிலம்" in t or "अंग्रेजी" in t:
            if "change" in t or "switch" in t or "to english" in t or "in english" in t:
                return ("en", "English")
        return None

    @classmethod
    def _detect_navigation_intent(cls, query: str) -> Optional[Dict[str, str]]:
        q = query.lower()
        
        # Scan Document
        if re.search(r"\b(open|take me to|go to|navigate to|launch)\b.*\b(scan|scanner|camera|camera scanner)\b", q) or q in ("open scan document", "scan document", "i want to scan a new document"):
            return {"type": "NAVIGATE", "path": "/citizen/scan", "label": "Scan Document"}

        # My Documents
        if re.search(r"\b(open|take me to|go to|show|view)\b.*\b(my documents|my papers|uploaded papers|uploaded deeds|document list)\b", q) or q in ("open my documents", "show my documents", "my documents"):
            return {"type": "NAVIGATE", "path": "/citizen/documents", "label": "My Documents"}

        # Land Search
        if re.search(r"\b(open|take me to|go to|navigate to)\b.*\b(land search|search|search property|search land)\b", q) or q in ("open land search", "land search"):
            return {"type": "NAVIGATE", "path": "/citizen/search", "label": "Land Search"}

        # GIS Map
        if re.search(r"\b(open|take me to|go to|show)\b.*\b(gis|gis map|parcel map|cadastral map|map)\b", q) or q in ("open gis map", "show me the map", "gis map"):
            return {"type": "NAVIGATE", "path": "/citizen/gis", "label": "GIS Parcel Map"}

        # Secure Storage
        if re.search(r"\b(open|take me to|go to)\b.*\b(storage|secure storage|vault|1gb storage)\b", q) or q in ("open secure storage", "open storage"):
            return {"type": "NAVIGATE", "path": "/citizen/storage", "label": "My Secure Storage"}

        # Disputes
        if re.search(r"\b(open|take me to|go to)\b.*\b(dispute|disputes|complaint|grievance)\b", q) or q in ("open disputes", "land disputes"):
            return {"type": "NAVIGATE", "path": "/citizen/disputes", "label": "Land Disputes"}

        # Officer Verification
        if re.search(r"\b(open|take me to|go to)\b.*\b(verification queue|verify documents|officer verification)\b", q):
            return {"type": "NAVIGATE", "path": "/officer/verification", "label": "Verification Queue"}

        # Duplicate Detection
        if re.search(r"\b(open|take me to|go to)\b.*\b(duplicate detection|duplicates|duplicate claims)\b", q):
            return {"type": "NAVIGATE", "path": "/officer/duplicates", "label": "Duplicate Detection"}

        # Profile
        if re.search(r"\b(open|take me to|go to|show)\b.*\b(profile|my profile|account|user profile)\b", q) or q in ("show my profile", "open profile"):
            return {"type": "NAVIGATE", "path": "/citizen/profile", "label": "User Profile"}

        # Notifications
        if re.search(r"\b(open|take me to|go to|show)\b.*\b(notification|notifications|alerts)\b", q) or q in ("open notifications", "show notifications"):
            return {"type": "NAVIGATE", "path": "/citizen/notifications", "label": "Notifications"}

        return None

    @classmethod
    def _handle_context_assistance(cls, path: str, lang: str) -> Dict[str, Any]:
        if "/citizen/scan" in path:
            return {
                "reply": "### 📸 Scan Document Guidance\n\nYou are on the **Scan Document** module. Follow this step-by-step workflow:",
                "flowchart": [
                    FlowchartStep(step=1, title="Capture Page", description="Click 'Capture Page' to snapshot deed pages using your camera."),
                    FlowchartStep(step=2, title="Compile Pages", description="Click 'Compile Pages' to bundle multi-page scans into a unified PDF."),
                    FlowchartStep(step=3, title="Extract OCR", description="Run OCR to digitize raw Tamil/English revenue typography."),
                    FlowchartStep(step=4, title="Get Document Details", description="Click 'Get Document Details' to extract 17 structured fields with confidence scores.")
                ],
                "suggested_actions": ["How does AI Review work?", "Open My Documents"],
                "action": None,
                "is_out_of_scope": False,
                "disclaimer": cls.DISCLAIMER
            }
        elif "/citizen/search" in path:
            return {
                "reply": "### 🔍 Land Records Search Guidance\n\nYou are on the **Land Search** module. Follow these steps to find registered land records:",
                "flowchart": [
                    FlowchartStep(step=1, title="Select State & District", description="Choose State (e.g. Tamil Nadu) and District (e.g. Chennai)."),
                    FlowchartStep(step=2, title="Select Taluk & Village", description="Dropdowns cascade dynamically based on selected district."),
                    FlowchartStep(step=3, title="Enter Land Identifier", description="Type Survey Number (e.g. 142/3A), Patta Number, or Owner Name."),
                    FlowchartStep(step=4, title="View Land Record", description="Inspect registered ownership particulars, extent, and GIS links.")
                ],
                "suggested_actions": ["Open GIS Map", "Open My Documents"],
                "action": None,
                "is_out_of_scope": False,
                "disclaimer": cls.DISCLAIMER
            }
        else:
            return {
                "reply": "### 💡 DigiLand Page Assistant\n\nI am ready to assist you on this page. Ask any question about land records, uploading deeds, or verifying certificates.",
                "suggested_actions": ["How to upload land document?", "Open Land Search", "How does AI Review work?"],
                "flowchart": None,
                "action": None,
                "is_out_of_scope": False,
                "disclaimer": cls.DISCLAIMER
            }

    @classmethod
    def _flowchart_upload_document(cls, lang: str) -> Dict[str, Any]:
        return {
            "reply": "### 📤 Step-by-Step Land Document Upload Procedure\n\nHere is how to upload and digitize your deed:",
            "flowchart": [
                FlowchartStep(step=1, title="Open Scan / Upload Module", description="Navigate to Scan Document or Document Upload in citizen portal.", action_btn=ActionButton(label="Open Scan Document", path="/citizen/scan")),
                FlowchartStep(step=2, title="Capture or Upload Deed", description="Take photo via camera scanner or upload existing PDF/image."),
                FlowchartStep(step=3, title="Compile Pages", description="Reorder and merge multiple physical deed pages into one document."),
                FlowchartStep(step=4, title="Extract OCR", description="Extract printed and handwritten Tamil/English text."),
                FlowchartStep(step=5, title="AI Review & Verification", description="View 17 extracted schedule fields and monitor Tahsildar approval status.")
            ],
            "suggested_actions": ["Open Scan Document", "Open My Documents", "How to search land?"],
            "action": {"type": "NAVIGATE", "path": "/citizen/scan", "label": "Scan Document"},
            "is_out_of_scope": False,
            "disclaimer": cls.DISCLAIMER
        }

    @classmethod
    def _flowchart_land_search(cls, lang: str) -> Dict[str, Any]:
        return {
            "reply": "### 🗺️ Land Records Search Procedure\n\nHere is how to locate any registered property record using cascading location hierarchy:",
            "flowchart": [
                FlowchartStep(step=1, title="Open Land Search", description="Navigate to the search module.", action_btn=ActionButton(label="Open Land Search", path="/citizen/search")),
                FlowchartStep(step=2, title="Cascading Location Selection", description="Select State → District → Taluk → Village in order."),
                FlowchartStep(step=3, title="Enter Land Identifier", description="Search by Survey No (e.g. 142/3A), Patta No, or Owner Name."),
                FlowchartStep(step=4, title="Inspect Ownership & GIS", description="Review legal owner details, area in Sq.Ft, and direct GIS parcel links.")
            ],
            "suggested_actions": ["Open Land Search", "Open GIS Map"],
            "action": {"type": "NAVIGATE", "path": "/citizen/search", "label": "Land Search"},
            "is_out_of_scope": False,
            "disclaimer": cls.DISCLAIMER
        }

    @classmethod
    def _flowchart_scan_document(cls, lang: str) -> Dict[str, Any]:
        return {
            "reply": "### 📸 Camera Scanner & OCR Procedure\n\nHere is how to operate the Camera Scanner and Document Extraction pipeline:",
            "flowchart": [
                FlowchartStep(step=1, title="Launch Camera", description="Grant camera permission and position deed flat within guidance frame.", action_btn=ActionButton(label="Open Scanner", path="/citizen/scan")),
                FlowchartStep(step=2, title="Capture Pages", description="Quality engine checks blur, brightness, and contrast in real time."),
                FlowchartStep(step=3, title="Compile Pages", description="Merge captured filmstrip pages into a consolidated revenue deed."),
                FlowchartStep(step=4, title="Extract OCR", description="Extract raw textual characters and numbers."),
                FlowchartStep(step=5, title="Get Document Details", description="View structured modal with 17 verified fields and confidence tags.")
            ],
            "suggested_actions": ["Open Scan Document", "How does AI Review work?"],
            "action": {"type": "NAVIGATE", "path": "/citizen/scan", "label": "Scan Document"},
            "is_out_of_scope": False,
            "disclaimer": cls.DISCLAIMER
        }

    @classmethod
    def _flowchart_land_dispute(cls, lang: str) -> Dict[str, Any]:
        return {
            "reply": "### ⚖️ Land Grievance & Dispute Redressal Procedure\n\nHere is how to file and track a land boundary or title dispute:",
            "flowchart": [
                FlowchartStep(step=1, title="Open Land Disputes Portal", description="Access the grievance management system.", action_btn=ActionButton(label="Open Disputes", path="/citizen/disputes")),
                FlowchartStep(step=2, title="Register New Grievance", description="Provide Survey Number, Village, Category, and detailed description."),
                FlowchartStep(step=3, title="Attach Supporting Evidence", description="Upload survey sketch, photos, or prior title documents."),
                FlowchartStep(step=4, title="Automated Case Number", description="System generates unique case tracking ID (e.g. DSP-TN-2026-0042)."),
                FlowchartStep(step=5, title="Track Audit Timeline", description="Monitor Tahsildar / Revenue Officer inspection remarks and final order.")
            ],
            "suggested_actions": ["Open Land Disputes", "How to verify Patta?"],
            "action": {"type": "NAVIGATE", "path": "/citizen/disputes", "label": "Land Disputes"},
            "is_out_of_scope": False,
            "disclaimer": cls.DISCLAIMER
        }

    @classmethod
    def _flowchart_gis_map(cls, lang: str) -> Dict[str, Any]:
        return {
            "reply": "### 🗺️ GIS Cadastral Parcel Map Inspection\n\nThe **GIS Cadastral Map** provides geospatial boundary and zoning inspection:",
            "flowchart": [
                FlowchartStep(step=1, title="Open GIS Map", description="Launch the interactive cadastral map.", action_btn=ActionButton(label="Open GIS Map", path="/citizen/gis")),
                FlowchartStep(step=2, title="Select Map Layer", description="Toggle between Street Cadastre and Satellite Ortho imagery."),
                FlowchartStep(step=3, title="Inspect Polygon", description="Click any survey polygon to view area, dimensions, street name, and building/land category.")
            ],
            "suggested_actions": ["Open GIS Map", "Open Land Search"],
            "action": {"type": "NAVIGATE", "path": "/citizen/gis", "label": "GIS Parcel Map"},
            "is_out_of_scope": False,
            "disclaimer": cls.DISCLAIMER
        }

    @classmethod
    def _flowchart_integrity(cls, lang: str) -> Dict[str, Any]:
        return {
            "reply": "### ⛓️ Blockchain-Inspired Tamper-Evident Integrity\n\nDigiLand uses **Cryptographic Integrity Chains**:",
            "flowchart": [
                FlowchartStep(step=1, title="Cryptographic SHA-256 Hash", description="Every uploaded deed version is hashed and linked to previous block."),
                FlowchartStep(step=2, title="HMAC Signature Verification", description="System validates block signatures on each access to detect tampering."),
                FlowchartStep(step=3, title="Public QR Verification", description="Certificates include a QR token verifying authenticity without revealing PII.")
            ],
            "suggested_actions": ["Open My Documents", "Open Land Search"],
            "action": {"type": "NAVIGATE", "path": "/citizen/documents", "label": "My Documents"},
            "is_out_of_scope": False,
            "disclaimer": cls.DISCLAIMER
        }

chatbot_service = ChatbotService()
