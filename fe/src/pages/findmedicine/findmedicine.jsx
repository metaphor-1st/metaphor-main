import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import "./findmedicine.css";
import MedicineCard from "../../components/medicineCard/medicineCard";
import CautionIcon from "../../images/cautionIcon.svg";

function FindMedicine() {
  const navigate = useNavigate();

const [diseaseData, setDiseaseData] = useState([]);
  const handleClick = () => {
    navigate("/");
  };

  useEffect(() => {
    //세션 스토리지에서 모든 데이터 가져오기
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    const painData = JSON.parse(sessionStorage.getItem('painData'));
    const medicineData = JSON.parse(sessionStorage.getItem('medicineData'));
        
    //전송할 데이터
    const requestData = {
      userData: userData,
      painData: painData,
      medicineData: medicineData,
    }

    console.log("결과라우터로 전송할 정보", requestData);

    fetch("http://localhost:4000/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData), 
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("서버 응답 데이터:", data);
        
        // 질병 데이터 가공
        const processedData = data.analysis.map((diseaseData) => ({
          ...diseaseData,
          medicines: diseaseData.medicine.split(/\/ ?/).map(med => med.trim()),
          //ingredients: diseaseData.ingredients.split(/\/ ?/).map(ing => ing.trim())
        }));
        
        setDiseaseData(processedData);
        console.log(processedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);


  return (
    <div>
      <Header />
      <div className="TitleBox">
       <h1>
    증상을 기반으로 찾아보니 <br />
    {diseaseData.length > 0 ? (
      <span style={{ color: "#2F5CE4" }}>{diseaseData[0]?.disease}</span>
    ) : (
      "데이터 로딩 중..."
    )}이 가장 유력해요
  </h1>
      </div>
      <div className="ContentResult">
        <div className="DiseaseDisc">
        <div className="DiseaseTitle">
    {diseaseData.length > 0 ? (
      <>
        <span style={{ color: "#2F5CE4" }}>{diseaseData[0]?.disease}</span> 외 비슷한 질병
      </>
    ) : ( 
      "질병 정보를 불러오는 중..."
    )}
  </div>
          <div className="TitleLine"></div>
          <span className="DiseaseDiscText">
    {diseaseData.length > 1
      ? diseaseData.slice(1).map((item, index) => (
          <span key={index}>{item.disease}{index !== diseaseData.length - 2 ? ', ' : ''}</span>
        ))
      : "비슷한 질병 정보 없음"}
  </span>
        </div>
        <div style={{ marginRight: "auto" }}>
          <h1 className="SubTitle" style={{ marginTop: "2rem" }}>
            이런 약을 추천드려요
          </h1>
        </div>
        <div>
         
      {diseaseData.length > 0 && (
  <div>
    {diseaseData.map((disease, index) => (
            <div key={index}>
              <h2>{disease.disease}</h2>
                <MedicineCard
                  key={index}
                  name={disease.medicine} // 약품 이름
                  ingredients={disease.ingredients || "성분 정보 없음"} // 성분 정보
                />
            </div>
          ))}
  </div>
)}

    </div>
    

        <h1 className="SubTitle" style={{ marginTop: "2rem" }}>
          혹시 아래 증상이 있으신가요?
        </h1>
        <div className="SymptomList">
        <ul>
            {diseaseData.length > 0 ? (
              diseaseData[0].medicalAttention.map((symptom, index) => (
                <li key={index}>{symptom.trim()}</li>
              ))
            ) : (
              <li>증상 정보를 불러오는 중...</li>
            )}
          </ul>
</div>
        <div className="CautionText">
          <img src={CautionIcon} alt="CautionIcon"></img>
          <span>위 증상이 있을 시, 의사와의 상의가 필요합니다</span>
        </div>
        <h1 className="SubTitle" style={{ marginTop: "2rem" }}>
          주의사항
        </h1>
        <div className="Precautions">
        <div className="PrecautionsText">
  {diseaseData.length > 0 ? (
    diseaseData[0].ageWarning
  ) : (
    <span>나이대별 주의사항이 제공되지 않았습니다.</span>
  )}
</div>

        </div>
        <div className="Precautions">
        <div className="PrecautionsText">

    <span>주의: 이 챗봇은 참고용으로만 사용하시기 바랍니다.
      <br/>정확한 진단을 위해서는 반드시 의료 전문가와 상담하세요.
      <br/>증상이 심각하다고 판단되면 즉시 병원을 방문하시기 바랍니다.</span>
</div>

        </div>
        <button onClick={handleClick} className="MapBtn">
          홈으로
        </button>
      </div>
    </div>
  );
}

export default FindMedicine;
