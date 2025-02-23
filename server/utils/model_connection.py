from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pyngrok import ngrok
import uvicorn
import pandas as pd
from datetime import datetime
import os
from dotenv import load_dotenv
import re

#.env 파일 로드
load_dotenv()

# 환경변수에서 토큰 가져오기
NGROK_AUTH_TOKEN = os.getenv("NGROK_AUTH_TOKEN")

# ✅ ngrok 인증 토큰 자동 설정
if NGROK_AUTH_TOKEN:
    ngrok.set_auth_token(NGROK_AUTH_TOKEN)
else:
    raise ValueError("NGROK_AUTH_TOKEN이 설정되지 않았습니다! .env 파일을 확인하세요.")

# Pydantic 모델 정의
class ChatRequest(BaseModel):
    userId: str
    bornYear: str
    sex: str
    pain: str
    description: str
    mediTF: bool = False

def create_sample_data():
    """테스트용 샘플 데이터 생성"""
    data = {
        '질환명': ['편두통', '군발성 두통', '긴장성 두통', '뇌수막염', '감기', '위염'],
        '증상': [
            '두통 한쪽 머리 통증 구토 어지러움 메스꺼움',
            '한쪽 머리 통증 눈통증 콧물 어지러움',
            '두통 목통증 어깨통증 메스꺼움 스트레스',
            '두통 구토 발열 목이 뻣뻣함 메스꺼움',
            '두통 발열 기침 콧물',
            '복통 메스꺼움 구토 소화불량'
        ],
        '추천 의약품': [
            '게보린',
            '타이레놀',
            '이지엔6',
            '항생제 처방 필요',
            '타이레놀',
            '개비스콘'
        ],
        '성분': [
            '이부프로펜',
            '아세트아미노펜',
            '나프록센',
            '처방약만 가능',
            '아세트아미노펜',
            '알긴산나트륨'
        ],
        '의사의 진료가  필요한 경우': [
            '두통이 24시간 이상 지속될 때\n시야가 흐려질 때',
            '통증이 매우 심할 때\n하루 여러번 발생할 때',
            '두통이 만성적일 때\n일상생활이 어려울 때',
            '즉시 병원 방문 필요\n응급상황일 수 있음',
            '고열이 3일 이상 지속될 때\n호흡곤란이 있을 때',
            '복통이 심하고 지속될 때\n위장 출혈 증상이 있을 때'
        ],
        '나이대 ': [
            '진통제 복용량 조절 필요',
            '노인 투약 주의',
            '청소년 복용량 조절',
            '연령별 항생제 처방 필요',
            '해열제 복용 시 주의',
            '위산 분비 조절제 주의'
        ]
    }
    return pd.DataFrame(data)

class SimplifiedMedicalChatbot:
    def __init__(self, data_path="/content/sample_data/sick.xlsx"):
        self.load_database(data_path)
        self.disclaimer = """
        주의: 이 챗봇은 참고용으로만 사용하시기 바랍니다.
        정확한 진단을 위해서는 반드시 의료 전문가와 상담하세요.
        증상이 심각하다고 판단되면 즉시 병원을 방문하시기 바랍니다.
        """

    def load_database(self, data_path):
        try:
            self.df = pd.read_excel(data_path)
            self.df = self.df.fillna('')
            print(f"데이터베이스 로드 완료: {len(self.df)} 개의 레코드")
        except Exception as e:
            print(f"데이터베이스 로딩 실패: {str(e)}")
            self.df = pd.DataFrame()

    def get_age_group(self, age):
        if age < 12:
            return "어린이"
        elif age >= 65:
            return "노인"
        else:
            return "성인"

    def simple_symptom_matching(self, pain, description):
        """증상 매칭 로직"""
        if '증상' not in self.df.columns:
            print("증상 컬럼이 데이터베이스에 없습니다.")
            return []

        matched_diseases = []
        symptoms = f"{pain} {description}".strip().split()

        for _, row in self.df.iterrows():
            db_symptoms = row['증상'].split()
            score = 0

            if pain.strip() and pain in row['증상']:
                score += 60

            desc_symptoms = description.strip().split() if description else []
            for symptom in desc_symptoms:
                if symptom in row['증상']:
                    score += 20

            if score > 0 or pain in row['증상']:
                matched_diseases.append((row['질환명'], score))

        sorted_diseases = sorted(matched_diseases, key=lambda x: x[1], reverse=True)

        if len(sorted_diseases) < 3:
            for _, row in self.df.iterrows():
                disease_name = row['질환명']
                if disease_name not in [d[0] for d in sorted_diseases]:
                    if pain in row['증상']:
                        sorted_diseases.append((disease_name, 10))
                        if len(sorted_diseases) >= 3:
                            break

        return sorted_diseases[:3]

    def get_medicine_info(self, disease, age_group, medi_tf=False):
        """질병과 나이대에 따른 약품 정보 반환"""
        try:
            disease_info = self.df[self.df['질환명'] == disease]

            if disease_info.empty:
                return {
                    "ageWarning": "",
                    "medicine": "",
                    "ingredients": "",
                    "medicalAttention": [],
                    "error": "해당 질병에 대한 정보를 찾을 수 없습니다."
                }

            result = {
                "ageWarning": "",
                "medicine": "",
                "ingredients": "",
                "medicalAttention": []
            }

            age_specific_info = disease_info['나이대 '].iloc[0]
            if age_specific_info:
                if age_group == "어린이":
                    result["ageWarning"] = f"어린이(12세 미만) 주의사항: {age_specific_info}"
                elif age_group == "노인":
                    result["ageWarning"] = f"노인(65세 이상) 주의사항: {age_specific_info}"

            if medi_tf:
                if disease_info['추천 의약품'].iloc[0]:
                    result["medicine"] = disease_info['추천 의약품'].iloc[0]
                if disease_info['성분'].iloc[0]:
                    result["ingredients"] = disease_info['성분'].iloc[0]

            medical_attention = disease_info['의사의 진료가  필요한 경우'].iloc[0]
            if medical_attention:
                attention_list = [item.strip() for item in medical_attention.split('\n')]
                result["medicalAttention"] = attention_list

            return result

        except Exception as e:
            print(f"의약품 정보 조회 중 오류: {str(e)}")
            return {
                "ageWarning": "",
                "medicine": "",
                "ingredients": "",
                "medicalAttention": [],
                "error": f"정보 조회 중 오류 발생: {str(e)}"
            }

    def process_request(self, request_data):
        """백엔드 요청 처리"""
        try:
            user_id = request_data.get("userId", "")
            born_year = request_data.get("bornYear", "")
            sex = request_data.get("sex", "")
            pain = request_data.get("pain", "")
            pain_description = request_data.get("description", "")
            medi_tf = request_data.get("mediTF", False)

            current_year = datetime.now().year
            age = current_year - int(born_year)
            age_group = self.get_age_group(age)

            matched_diseases = self.simple_symptom_matching(pain, pain_description)

            response = {
                "userId": user_id,
                "age": age,
                "ageGroup": age_group,
                "sex": sex,
                "analysis": []
            }

            if matched_diseases:
                response["analysis"] = []
                for disease, confidence in matched_diseases:
                    medical_info = self.get_medicine_info(disease, age_group, medi_tf)
                    disease_info = {
                        "disease": disease,
                        "confidence": confidence,
                        "ageWarning": medical_info["ageWarning"],
                        "medicine": medical_info["medicine"],
                        "ingredients": medical_info["ingredients"],
                        "medicalAttention": medical_info["medicalAttention"]
                    }
                    response["analysis"].append(disease_info)
            else:
                response["analysis"].append({
                    "disease": None,
                    "confidence": 0.0,
                    "ageWarning": "",
                    "medicine": "",
                    "ingredients": "",
                    "medicalAttention": [],
                    "error": "일치하는 질병을 찾을 수 없습니다."
                })

            response["disclaimer"] = self.disclaimer

            return {
                "json_response": response,
                "chat_message": self.format_chat_response(response)
            }

        except Exception as e:
            error_response = {
                "error": f"요청 처리 중 오류 발생: {str(e)}",
                "disclaimer": self.disclaimer
            }
            return {
                "json_response": error_response,
                "chat_message": f"죄송합니다. 오류가 발생했습니다: {str(e)}\n\n{self.disclaimer}"
            }

    def format_chat_response(self, response_data):
        """JSON 응답을 사용자 친화적인 텍스트로 변환"""
        chat_response = []

        chat_response.append(f"\n[{response_data['ageGroup']}({response_data['age']}세) / {response_data['sex']} 사용자 분석 결과]")

        for analysis in response_data['analysis']:
            if analysis.get('disease'):
                chat_response.append(f"\n## 추정 질환: {analysis['disease']}")
                if 'confidence' in analysis:
                    chat_response.append(f"신뢰도: {analysis['confidence']:.1f}%")
                if analysis['ageWarning']:
                    chat_response.append(analysis['ageWarning'])
                if analysis['medicine']:
                    chat_response.append(f"추천 의약품: {analysis['medicine']}")
                if analysis['ingredients']:
                    chat_response.append(f"주요 성분: {analysis['ingredients']}")
                if analysis['medicalAttention']:
                    chat_response.append("의사의 진료가 필요한 경우:")
                    chat_response.extend(analysis['medicalAttention'])
            else:
                chat_response.append("\n일치하는 질병을 찾을 수 없습니다.")
            chat_response.append("-" * 40)

        chat_response.append(f"\n{response_data['disclaimer']}")

        return "\n".join(chat_response)


# 챗봇 인스턴스 생성
chatbot = None


def startup_event():
    global chatbot
    # 샘플 데이터 생성 및 저장
    sample_df = create_sample_data()
    data_dir = "/content/sample_data"
    os.makedirs(data_dir, exist_ok=True)
    temp_file = f"{data_dir}/sick.xlsx"
    sample_df.to_excel(temp_file, index=False)
    
    # 챗봇 초기화
    chatbot = SimplifiedMedicalChatbot(temp_file)

    public_url = start_ngrok()
    print(f" * Public URL: {public_url}")
    
# FastAPI 앱 생성
app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Medical Chatbot API is running"}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not chatbot:
        raise HTTPException(status_code=500, detail="Chatbot not initialized")
    
    try:
        result = chatbot.process_request(request.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

url_string=""

def start_ngrok():
    public_url = ngrok.connect(8000)
    print(f" * Public URL: {public_url}", flush=True)
    
    # 실제 요청 보내야하는 url 추출
    global url_string
    url_string = public_url.public_url
    print(url_string, flush=True)
    return public_url


# 요청보낼 url node서버로 전달
@app.get('/get_url')
def get_url():
    return {"url": url_string}



def start_server():
    startup_event()
    #서버 시작
    uvicorn.run(app, host="0.0.0.0", port=8000)
    

if __name__ == "__main__":
    start_server()