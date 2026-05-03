# 🦶 Diabetic Foot Ulcer Detection System (AI-Based)

🚀 An end-to-end AI-powered web application that detects and classifies **Diabetic Foot Ulcers (DFU)** from medical images using deep learning.

Built with a **full-stack architecture (React + Flask + TensorFlow)** and deployed on **Hugging Face Spaces**, this project demonstrates real-world AI deployment in healthcare.

---

## 🔗 Live Demo

👉 **Backend API (HuggingFace):**
https://ankitsunil530-dfu-backend.hf.space

👉 Frontend: https://diabetic-foot-ulcer-detection-dfu.vercel.app/

---

## 📌 Features

* 🧠 **Deep Learning Model** for DFU classification
* 📷 Upload medical images (JPG/PNG)
* 📊 Predicts:

  * Ulcer / Normal
  * Stage (No Ulcer, Mild, Moderate, Severe)
  * Confidence Score
* ⚠️ Risk Level Detection (Low / High)
* 💡 Medical Advice Suggestion
* 🖥️ Clean React UI with image preview & history
* ☁️ Deployed API using Flask on HuggingFace Spaces

---

## 🏗️ Tech Stack

### 💻 Frontend

* React.js
* Tailwind CSS
* Axios / Fetch API

### ⚙️ Backend

* Flask
* Flask-CORS

### 🤖 Machine Learning

* TensorFlow / Keras
* Custom Layer (Spatial Attention)
* OpenCV & NumPy

### ☁️ Deployment

* Hugging Face Spaces
* REST API Architecture

---

## 🧠 Model Details

* Input Size: **224 × 224**
* Output Classes:

  * No Ulcer
  * Mild
  * Moderate
  * Severe
* Custom Layer: `SpatialAttentionLayer`
* Model Format: `.keras`

---

## 📡 API Endpoints

### 🔹 Health Check

```http
GET /api/health
```

Response:

```json
{
  "ok": true
}
```

---

### 🔹 Predict Image

```http
POST /api/predict
```

**Request (form-data):**

```
key: image
value: <image file>
```

**Response:**

```json
{
  "ok": true,
  "prediction": "Ulcer",
  "stage": "Moderate",
  "confidence": 0.87,
  "risk_level": "High",
  "advice": "Consult a doctor immediately"
}
```

---

## 🚀 Installation & Setup

### 🔧 Backend (Flask)

```bash
git clone https://github.com/your-username/dfu-project.git
cd dfu-project/backend

pip install -r requirements.txt
python app.py
```

---

### 💻 Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Environment Variables

Create `.env` in frontend:

```bash
VITE_API_BASE_URL=https://ankitsunil530-dfu-backend.hf.space
```

---

## 📂 Project Structure

```
dfu-project/
│
├── backend/
│   ├── app.py
│   ├── utils.py
│   ├── final_model.keras
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── lib/
│
└── README.md
```

---

## ⚠️ Disclaimer

This project is for **educational and research purposes only**.
It is **not a substitute for professional medical diagnosis**.

---

## 📈 Future Improvements

* 📊 Model accuracy improvement with larger dataset
* 📱 Mobile app integration
* 🧑‍⚕️ Doctor consultation feature
* 📦 Docker deployment
* 🔐 Authentication system

---

## 👨‍💻 Author

**Sunil Kumar**
🎓 B.Tech CSE (IIITDM Jabalpur)
💼 Full-Stack Developer | AI/ML Enthusiast

🔗 GitHub: https://github.com/ankitsunil530

---

## ⭐ Show Your Support

If you like this project:

⭐ Star the repo
🍴 Fork it
📢 Share it

---

## 💡 Why This Project Matters

Diabetic foot ulcers can lead to severe complications if not detected early.
This system aims to assist in **early detection using AI**, making healthcare more accessible and efficient.

---
