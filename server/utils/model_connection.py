from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = Flask(__name__)

# 모델 로드
model_name = "0208suin/newchatformedicine"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

@app.route('/predict', methods=['POST', 'GET'])
def predict():
    if request.method == 'GET':
        print('get요청입니다')

    data = request.json
    text = data['text']
    
    # 토큰화 및 예측
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
    probabilities = torch.softmax(outputs.logits, dim=-1)
    
    # 클래스 레이블 가져오기 (모델에 정의된 경우)
    labels = model.config.id2label if hasattr(model.config, 'id2label') else None
    
    # 결과 준비
    predictions = []
    for i, prob in enumerate(probabilities[0]):
        label = labels[i] if labels else f"Class {i}"
        predictions.append({"label": label, "probability": prob.item()})

    # 결과 반환
    return jsonify({'predictions': predictions})

if __name__ == '__main__':
    app.run(debug=True)