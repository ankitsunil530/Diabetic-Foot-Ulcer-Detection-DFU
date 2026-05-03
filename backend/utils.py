import tensorflow as tf
import numpy as np
import cv2


# 🔥 Custom Layer
class SpatialAttentionLayer(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def call(self, x):
        avg = tf.reduce_mean(x, axis=-1, keepdims=True)
        max_ = tf.reduce_max(x, axis=-1, keepdims=True)
        return tf.concat([avg, max_], axis=-1)

    def get_config(self):
        return super().get_config()


# 🖼️ Preprocessing
def preprocess_image(img):
    IMG_SIZE = 224

    img = np.array(img)
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    return img


# 🧠 Prediction → Stage
def get_stage(pred):
    class_names = ["No Ulcer", "Mild", "Moderate", "Severe"]
    return class_names[int(np.argmax(pred))]