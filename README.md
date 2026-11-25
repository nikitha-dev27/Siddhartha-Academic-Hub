# Siddhartha Academic Hub
A student-friendly previous examination papers portal for P.B. Siddhartha College of Arts & Science.

## Features
- Public course -> semester (1-6) -> exam category -> year browsing
- Public PDF preview/open/download
- Search papers by title, course or year
- Admin-key protected CRUD for courses, papers and notices
- PDF upload
- Optional Gemini AI exam-preparation insights

## Stack
React + Vite + CSS; Java 17 + Spring Boot + Spring Data JPA; MySQL; optional Google Gemini API.

## Run locally
### Database
Create a database in MySQL:
```sql
CREATE DATABASE siddhartha_academic_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
### Backend
1. Install Java 17+ and Maven.
2. `cd backend`
3. Copy `.env.example` values into environment variables (or edit `src/main/resources/application.properties`).
4. Run `mvn spring-boot:run`.
Backend: `http://localhost:8080/api`; health: `/api/health`.

### Frontend
1. Install Node.js LTS.
2. `cd frontend && npm install && npm run dev`.
3. Open the Vite URL.

## Admin
Set `ADMIN_KEY` on the backend. In the Admin panel, enter that key. Admin APIs use `X-ADMIN-KEY`.
This starter uses a shared admin key rather than a full multi-user identity system. Do not expose the key in public deployments; use a secure secret and HTTPS. For a production college portal, replace shared-key auth with individual admin accounts, roles, audit logs and rate limits.


## AI
Set `GEMINI_API_KEY` and `GEMINI_MODEL` (default `gemini-2.0-flash`) to enable AI study insights. The AI endpoint is optional; without the key the rest of the portal works.


## Uploads
Uploaded PDFs are saved to `uploads/papers` on the backend host. Local disk may be ephemeral on cloud hosting; for production use object storage (S3/Cloudinary) and update the upload service.


## Initial course list
The course list is based on programmes publicly listed on the college website, and is editable in Admin. Confirm current programme names/sections with the college before publishing. Paper records are empty initially; admins must upload authentic PDFs.
