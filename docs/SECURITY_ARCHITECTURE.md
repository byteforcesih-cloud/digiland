# DigiLand Security & Compliance Architecture

This document details the security design, data privacy mechanisms, encryption standards, and external enterprise security integration layers for **DigiLand – AI-Powered Digital Land Record Management System**.

---

## 1. Application-Level Security Controls

### Role-Based Access Control (RBAC)
- **Citizens**: Restricted strictly to their own uploaded deeds, version trails, personal notifications, and individual audit logs.
- **Government Officers**: Authorized to inspect citizen records within assigned sub-divisions/districts, verify split-screen deeds, edit extracted fields, and resolve duplicate or validation flags.
- **Enforcement**: JWT bearer token claims are cryptographically verified in FastAPI dependencies (`get_current_citizen`, `get_current_officer`).

### Sensitive Data Protection (AES-256-GCM & PII Masking)
- **Aadhaar Privacy**: Cleaned 12-digit Aadhaar numbers are never stored in plain text. Deterministic SHA-256 hashes are used for duplicate prevention, while user views only ever display masked formats (`XXXX-XXXX-4819`).
- **Symmetric Encryption**: Critical field payloads use AES-256-GCM authenticated encryption with 12-byte random initialization nonces.
- **Password Security**: Passwords hashed using `bcrypt` with work factor salt rounds.

### Immutable Audit Trail
- Every critical lifecycle action (`USER_REGISTER`, `USER_LOGIN`, `DOCUMENT_UPLOAD`, `DOCUMENT_VERSION_UPDATE`, `OFFICER_DECISION_APPROVE`, `OFFICER_DECISION_REJECT`, `DUPLICATE_RESOLUTION`) records user identity, role, IP address, user-agent, and before/after diffs in the `audit_logs` table.

---

## 2. Enterprise WAF Layer: ModSecurity + OWASP CRS

In production deployments, DigiLand is fronted by an NGINX reverse proxy equipped with **ModSecurity v3** and the **OWASP Core Rule Set (CRS v3.3+)**.

### Sample NGINX Reverse Proxy Configuration with ModSecurity

```nginx
server {
    listen 443 ssl http2;
    server_name landrecords.digiland.gov.in;

    ssl_certificate /etc/ssl/certs/digiland_tls.crt;
    ssl_certificate_key /etc/ssl/private/digiland_tls.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Enable ModSecurity Web Application Firewall
    modsecurity on;
    modsecurity_rules_file /etc/nginx/modsec/main.conf;

    # Frontend Static Assets & SPA Routing
    location / {
        root /var/www/digiland/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend FastAPI REST Endpoints
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploaded Previews (Protected & Rate Limited)
    location /uploads/ {
        alias /var/www/digiland/uploads/;
        add_header X-Content-Type-Options "nosniff";
        add_header X-Frame-Options "DENY";
    }
}
```

---

## 3. Dynamic Application Security Testing (DAST): OWASP ZAP

OWASP Zed Attack Proxy (ZAP) is integrated into CI/CD pipelines to scan DigiLand for common injection and API vulnerabilities.

### Automated Baseline Scan Command

```bash
docker run -t --network="host" ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
    -t http://127.0.0.1:8000/docs \
    -r zap_report.html \
    -I
```

### Full API Security Scan with OpenAPI Specification

```bash
docker run -t --network="host" ghcr.io/zaproxy/zaproxy:stable zap-api-scan.py \
    -t http://127.0.0.1:8000/openapi.json \
    -f openapi \
    -r zap_api_report.html
```

---

## 4. Infrastructure Vulnerability Scanning: OpenVAS / Greenbone

**OpenVAS (Open Vulnerability Assessment System)** is scheduled periodically against the host servers running the PostgreSQL database and FastAPI containers:
- Network port auditing (confirming non-essential ports are firewalled).
- SSL/TLS cipher suite validation.
- Database service hardening and PostgreSQL connection isolation.
