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
    fetch("http://localhost:4000/result", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const processedData = data.analysis.map((diseaseData) => {
          // 약품 리스트 분리
          const medicines = diseaseData.medicine.split(/\/ ?/).map(med => med.trim());

           // 성분 정보 매핑
          const ingredientMapping = diseaseData.ingredients.split(/(?=\w+\/)/).reduce((acc, entry) => {
            const [medicineName, ingredient] = entry.split('/');
            if (medicineName && ingredient) {
              acc[medicineName.trim()] = ingredient.trim();
            }
            return acc;
          }, {});

          return {
            ...diseaseData,
            medicines: medicines.map(medicine => ({
              name: medicine,
              ingredients: ingredientMapping[medicine] || "성분 정보 없음"
            }))
          };
        });
        setDiseaseData(processedData);
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
          {/* 3가지 질병에 대한 추천 약을 모두 보여줌 */}
        {/* {diseaseData.map((diseaseData, index) => (
        <div key={index}>
          {diseaseData.medicines.map((medicineData, medIndex) => (
            <MedicineCard
              key={`${index}-${medIndex}`}
              name={medicineData.name}
              ingredients={medicineData.ingredients}
            />
          ))}
        </div>
      ))} */}
      {/* 맨 첫번째 질병에 대한 약만 보여줌 */}
      {diseaseData.length > 0 && (
  <div>
    {diseaseData[0].medicines.map((medicineData, medIndex) => (
      <MedicineCard
        key={medIndex}
        name={medicineData.name}
        ingredients={medicineData.ingredients}
      />
    ))}
  </div>
)}

    </div>
    

        <h1 className="SubTitle" style={{ marginTop: "2rem" }}>
          혹시 아래 증상이 있으신가요?
        </h1>
        <div className="SymptomList">
  <ul>
    {diseaseData.length > 0 ? (diseaseData[0].medicalAttention) : "증상 정보를 불러오는 중..."}
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
