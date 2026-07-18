from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import traceback
import os

from utils import preprocess_image, get_stage, SpatialAttentionLayer

# ------------------ Fix quantization_config issue ------------------
from keras.layers import Dense

original_init = Dense.__init__

def new_init(self, *args, **kwargs):
    kwargs.pop("quantization_config", None)
    original_init(self, *args, **kwargs)

Dense.__init__ = new_init


# ------------------ Flask App ------------------
app = Flask(__name__)
CORS(app)

# Reject uploads larger than 10 MB before the request body is read, so a very
# large file can't exhaust server memory via file.read(). Flask raises 413
# Request Entity Too Large automatically once this limit is exceeded.
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10 MB

# Server-side allow-list of accepted image MIME types. The browser dropzone
# already restricts to JPG/PNG, but any direct API client (curl, Postman)
# bypasses that — so the same guard is enforced here.
ALLOWED_TYPES = {"image/jpeg", "image/png"}


# ------------------ Load Model ------------------
MODEL_PATH = "final_model.keras"

model = None

def load_model():
    global model
    try:
        model = tf.keras.models.load_model(
            MODEL_PATH,
            custom_objects={"SpatialAttentionLayer": SpatialAttentionLayer},
            compile=False,
            safe_mode=False
        )
        print("✅ Model Loaded Successfully")
    except Exception:
        print("❌ Model Loading Failed")
        traceback.print_exc()

load_model()


# ------------------ Routes ------------------

@app.route("/")
def home():
    return jsonify({
        "message": "🚀 DFU API Running",
        "status": "OK"
    })


@app.route("/api/health")
def health():
    return jsonify({"ok": True})


@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        if model is None:
            return jsonify({"ok": False, "error": "Model not loaded"}), 500

        if "image" not in request.files:
            return jsonify({"ok": False, "error": "No file uploaded"}), 400

        file = request.files["image"]

        if file.filename == "":
            return jsonify({"ok": False, "error": "Empty file"}), 400

        # -------- Validate file type (server-side) --------
        # A non-image upload is a client error (400), not a server error (500).
        if file.content_type not in ALLOWED_TYPES:
            return jsonify({
                "ok": False,
                "error": "Invalid file type. Only JPEG and PNG are accepted."
            }), 400

        # -------- Read Image --------
        # Pillow raises UnidentifiedImageError on a file it can't decode (e.g. a
        # renamed non-image). Catch it here and return 400 so it doesn't fall
        # through to the generic 500 handler below.
        try:
            img = Image.open(io.BytesIO(file.read())).convert("RGB")
        except Exception:
            return jsonify({
                "ok": False,
                "error": "Could not read image. Please upload a valid JPEG or PNG."
            }), 400

        # -------- Preprocess --------
        input_img = preprocess_image(img)

        # -------- Predict --------
        raw_pred = model.predict(input_img)
        
        # -------- Temperature Scaling Calibration --------
        # Soften overconfident predictions using a temperature T > 1.0
        T = 1.5
        # Convert probabilities back to logits approximately to apply scaling
        logits = np.log(np.clip(raw_pred, 1e-7, 1.0))
        scaled_logits = logits / T
        # Re-apply softmax to get calibrated probabilities
        exp_scaled = np.exp(scaled_logits - np.max(scaled_logits, axis=1, keepdims=True))
        pred = exp_scaled / np.sum(exp_scaled, axis=1, keepdims=True)

        confidence = float(np.max(pred))
        stage = get_stage(pred)

        label = "Normal" if stage == "No Ulcer" else "Ulcer"

        # -------- Confidence low case --------
        # The frontend always reads risk_level and advice from the response, so
        # both must be present here too — otherwise the result card renders an
        # undefined risk and no advice for any low-confidence prediction. The
        # values reflect the uncertainty; the note flag is retained.
        if confidence < 0.6:
            return jsonify({
                "ok": True,
                "prediction": label,
                "stage": stage,
                "confidence": round(confidence, 4),
                "risk_level": "Unknown",
                "advice": "Low confidence result — please consult a medical professional",
                "note": "Low confidence prediction"
            })

        # -------- Risk logic --------
        risk = "High" if stage in ["Moderate", "Severe"] else "Low"

        advice = (
            "Consult a doctor immediately"
            if stage in ["Moderate", "Severe"]
            else "Monitor regularly"
        )

        return jsonify({
            "ok": True,
            "prediction": label,
            "stage": stage,
            "confidence": round(confidence, 4),
            "risk_level": risk,
            "advice": advice
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


# ------------------ Run ------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))   # 🔥 HF default port
    app.run(host="0.0.0.0", port=port)