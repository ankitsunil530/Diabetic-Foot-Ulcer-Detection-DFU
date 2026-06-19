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

        # -------- Read Image --------
        img = Image.open(io.BytesIO(file.read())).convert("RGB")

        # -------- Preprocess --------
        input_img = preprocess_image(img)

        # -------- Predict --------
        pred = model.predict(input_img)
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