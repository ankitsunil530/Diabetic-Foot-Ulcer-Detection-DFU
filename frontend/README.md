# Frontend (React + Tailwind)

Modern medical-style dashboard UI for the Diabetic Foot Ulcer (DFU) detection project.

## Pages

- `/` Home (hero + features + backend health badge)
- `/analyze` Drag & drop upload + validation + step loader
- `/results/:id` Result (label, confidence bar, severity, explanation, report download)
- `/history` Local history with filters (All/Ulcer/Normal)

## Configure API

Default API base URL: `http://localhost:5000`

Override:

```powershell
$env:VITE_API_BASE_URL = \"http://localhost:5000\"
```

## Run

```powershell
cd frontend
npm install
npm run dev
```
