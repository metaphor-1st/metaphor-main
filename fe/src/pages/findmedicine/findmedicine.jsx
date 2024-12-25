import axios from "../../axiosInstance";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Wrapper } from "@googlemaps/react-wrapper";
import Header from "../../components/header/header";
import "./findmedicine.css";
import MedicineCard from "../../components/medicineCard/medicineCard";
import Medicine1 from "../../images/타이레놀.png";
import Medicine2 from "../../images/마이드린.png";
import Medicine3 from "../../images/낙센.png";
import CautionIcon from "../../images/cautionIcon.svg";

function FindMedicine() {
  const location = useLocation();
  const navigate = useNavigate();

  const diseaseName = "편두통";
  const DiseaseDisc =
    "일반적으로 12세 미만의 어린이에게는 권장되지 않습니다. 12세 이상일 경우, 성인 용량의 절반 정도를 투여할 수 있으나, 정확한 용량은 의사와 상담 후 결정해야 합니다.";

   // 전달받은 데이터
   const { lat, lng } = location.state || {};

   // 데이터를 새 페이지로 전달하는 함수
  //  const handleClick = () => {
  //    navigate("/resultMap", { state: { lat, lng } });
  //  };

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div>
      <Header />
      <div className="TitleBox">
        <h1>
          증상을 기반으로 찾아보니 <br />
          <span style={{ color: "#2F5CE4" }}>{diseaseName}</span>이 가장
          유력해요
        </h1>
      </div>
      <div className="ContentResult">
        <div className="DiseaseDisc">
          <div className="DiseaseTitle">
            <span style={{ color: "#2F5CE4" }}>{diseaseName}</span>은 이렇습니다
          </div>
          <div className="TitleLine"></div>
          <span className="DiseaseDiscText">{DiseaseDisc}</span>
        </div>
        <div style={{ marginRight: "auto" }}>
          <h1 className="SubTitle" style={{ marginTop: "2rem" }}>
            이런 약을 추천드려요
          </h1>
        </div>
        <MedicineCard
          name={"타이레놀"}
          kind={"진통제"}
          dose={"성인 1회 1정"}
          pic={Medicine1}
        />
        <MedicineCard
          name={"마이드린"}
          kind={"진통제"}
          dose={"성인 1회 1정"}
          pic={Medicine2}
        />
        <MedicineCard
          name={"낙센"}
          kind={"진통제"}
          dose={"성인 1회 1정"}
          pic={Medicine3}
        />
        <h1 className="SubTitle" style={{ marginTop: "2rem" }}>
          혹시 아래 증상이 있으신가요?
        </h1>
        <div className="SymptomList">
          <ul>
            <li>태어나서 지금까지 느끼지 못했던 통증</li>
            <li>50세 이후에 시작된 두통</li>
            <li>열이 나거나 목이 뻣뻣하고 피부에 발진이 동반되는 두통</li>
            <li>HIV 감염자나 암 환자에서 평소와 다른 두통이 느껴질 때</li>
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
            혈압약, 항우울제, 항응고제 등과 함께 복용 시 상호작용성을 반드시
            의사와 상의하세요
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
