from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import traceback
import os
from utils import preprocess_image, get_stage, SpatialAttentionLayer

# 🔥 Fix quantization_config issue
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

try:
    model = tf.keras.models.load_model(
        MODEL_PATH,
        custom_objects={"SpatialAttentionLayer": SpatialAttentionLayer},
        compile=False,
        safe_mode=False
    )
    print("✅ Model Loaded Successfully")

except Exception as e:
    print("❌ Model Loading Failed")
    traceback.print_exc()
    model = None

# ------------------ Routes ------------------

@app.route("/")
def home():
    return jsonify({
        "message": "🚀 DFU API Running",
        "status": "OK"
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        # 🔴 Model check
        if model is None:
            return jsonify({"error": "Model not loaded"}), 500

        # 🔴 File check
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        # 🔴 Empty file check
        if file.filename == "":
            return jsonify({"error": "Empty file"}), 400

        # ------------------ Read Image ------------------
        img = Image.open(io.BytesIO(file.read())).convert("RGB")

        # ------------------ Preprocess ------------------
        input_img = preprocess_image(img)

        # ------------------ Prediction ------------------
        pred = model.predict(input_img)
        confidence = float(np.max(pred))
        stage = get_stage(pred)

        # ------------------ Label Logic ------------------
        if stage == "No Ulcer":
            label = "Normal"
        else:
            label = "Ulcer"

        # ------------------ Confidence Threshold ------------------
        if confidence < 0.6:
            return jsonify({
                "prediction": "Uncertain",
                "confidence": round(confidence, 4),
                "stage": "Unknown",
                "message": "Model is not confident. Please upload a clearer image."
            })

        # ------------------ Risk Level ------------------
        risk = "High" if stage in ["Moderate", "Severe"] else "Low"

        advice = (
            "Consult a doctor immediately"
            if stage in ["Moderate", "Severe"]
            else "Monitor regularly"
        )

        # ------------------ Response ------------------
        return jsonify({
            "prediction": label,
            "stage": stage,
            "confidence": round(confidence, 4),
            "risk_level": risk,
            "advice": advice
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ------------------ Run ------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)