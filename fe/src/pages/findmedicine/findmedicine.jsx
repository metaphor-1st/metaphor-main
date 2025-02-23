import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import "./findmedicine.css";
import MedicineCard from "../../components/medicineCard/medicineCard";
import CautionIcon from "../../images/cautionIcon.svg";

function FindMedicine() {
  const navigate = useNavigate();
  const [disease, setDisease] = useState("편두통"); 
const [resultdescription, setResultdescription] = useState("."
); // 증상

const [caution, setCaution] = useState(""); // 주의사항

const [diseaseData, setDiseaseData] = useState([]);
  const handleClick = () => {
    navigate("/");
  };

  useEffect(() => {
    // Fetch data from the backend
    fetch("http://localhost:4000/result", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const processedData = data.analysis.map((diseaseData) => {
          const medicines = diseaseData.medicine.split(/\/ ?/).map(med => med.trim());
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

  const painText = "1. 태어나서 지금까지 느끼지 못했던 통증 2. 50세 이후에 시작된 두통 3. 열이 나거나 목이 뻣뻣하고 피부에 발진이 동반되는 두통 4. HIV 감염자나 암 환자에서 평소와 다른 두통이 느껴질 때"

  const cautionText = "혈압약, 항우울제, 항응고제 등과 함께 복용 시 상호작용성을 반드시 의사와 상의하세요";


  return (
    <div>
      <Header />
      <div className="TitleBox">
        <h1>
          증상을 기반으로 찾아보니 <br />
          <span style={{ color: "#2F5CE4" }}>{diseaseData.disease}</span>이 가장
          유력해요
        </h1>
      </div>
      <div className="ContentResult">
        <div className="DiseaseDisc">
          <div className="DiseaseTitle">
            <span style={{ color: "#2F5CE4" }}>{disease}</span> 외 비슷한 질병
          </div>
          <div className="TitleLine"></div>
          <span className="DiseaseDiscText">여기 다른 병명넣기.
            {resultdescription}</span>
        </div>
        <div style={{ marginRight: "auto" }}>
          <h1 className="SubTitle" style={{ marginTop: "2rem" }}>
            이런 약을 추천드려요
          </h1>
        </div>
        <div>
        {diseaseData.map((diseaseData, index) => (
        <div key={index}>
          {diseaseData.medicines.map((medicineData, medIndex) => (
            <MedicineCard
              key={`${index}-${medIndex}`}
              name={medicineData.name}
              ingredients={medicineData.ingredients}
            />
          ))}
        </div>
      ))}
    </div>
        {/* <MedicineCard name={recommendedMedi} ingredients={mediIngreidents} />
        <MedicineCard name={recommendedMedi} ingredients={mediIngreidents} />
        <MedicineCard name={recommendedMedi} ingredients={mediIngreidents} /> */}
        <h1 className="SubTitle" style={{ marginTop: "2rem" }}>
          혹시 아래 증상이 있으신가요?
        </h1>
        <div className="SymptomList">
  <ul>
    {painText.match(/\d+\.\s[^0-9]+/g)?.map((text, index) => (
      <li key={index}>{text.replace(/^\d+\.\s/, "").trim()}</li>
    ))}
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
  {caution ? (
    caution
  ) : (
    <span>주의사항이 제공되지 않았습니다.</span>
  )}
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
