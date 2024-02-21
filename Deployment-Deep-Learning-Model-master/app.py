from flask import Flask, request, render_template, jsonify
import cv2 as cv
import numpy as np
from keras.models import load_model
from sklearn.metrics import precision_recall_fscore_support, confusion_matrix
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Model saved with Keras model.save()
MODEL_PATH = 'fruit_recog.h5'

# Load your trained model
model = load_model(MODEL_PATH)
print('Model loaded. Check http://127.0.0.1:5000/')

# Define the class names
class_names = ['banana', 'watermelon', 'orange']

# Function to preprocess the image
def preprocess_image(image_path):
    img = cv.imread(image_path)
    img = cv.resize(img, (32, 32))
    img = img / 255.0
    return img

# Function to make a prediction
def model_predict(file, model):
    img = preprocess_image(file)
    x = np.expand_dims(img, axis=0)
    preds = model.predict(x)
    pred_class_index = np.argmax(preds)
    probability = preds[0][pred_class_index]
    predicted_class = class_names[pred_class_index]
    return predicted_class, probability

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def upload():
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']
        # Save the file
        file_path = 'uploads/' + secure_filename(f.filename)
        f.save(file_path)
        # Make prediction
        predicted_class, probability = model_predict(file_path, model)
        
        # Return prediction result along with validation metrics
        return jsonify({
            'predicted_class': predicted_class, 
            'probability': str(probability),
            'validation_accuracy': 0.9130434989929199,  # Insert validation accuracy here
            'validation_loss': 0.3723427355289459,       # Insert validation loss here
            'precision': 0.9236024844720496,             # Insert precision here
            'recall': 0.9130434782608695,                # Insert recall here
            'f1_score': 0.9091748614785603,              # Insert F1 score here
            'confusion_matrix': [[30, 0, 0], [0, 32, 0], [5, 3, 22]]  # Insert confusion matrix here
        })

if __name__ == '__main__':
    app.run(debug=True)
