import ProgressBar from "../../components/progressBar/progressBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/header/header";
import SearchBar from "../../components/searchBar/SearchBar";
import "./medecineInfo.css";
function MedicineInfo() {
  const [selectedBoolean, setSelectedBoolean] = useState(null);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/locationInfo");
  };
  const handleBtnSelect = boolean => {
    setSelectedBoolean(boolean);
  };
  return (
    <div>
      <Header />
      <div className="InfoWrap">
        <h1 className="StepTitle">복용중인 약이 있으신가요?</h1>
        <ProgressBar currentStep={2} />
        <div className="BooleanBtnWrap">
          <button
            className={`BooleanBtn ${
              selectedBoolean === "yes" ? "selected" : ""
            }`}
            onClick={() => handleBtnSelect("yes")}>
            예
          </button>
          <button
            className={`BooleanBtn ${
              selectedBoolean === "no" ? "selected" : ""
            }`}
            onClick={() => handleBtnSelect("no")}>
            아니요
          </button>
        </div>
        {selectedBoolean === "yes" && (
          <div className="SelectYes">
            <h1 className="SubTitle">어떤 약을 복용 중이신가요?</h1>
            <SearchBar text={"어떤 종류의 약인지 입력해주세요 ex)항우울제"} />
          </div>
        )}
        <button onClick={handleClick} className={`NextBtn ${!selectedBoolean ? "unselected" : ""}`}>
          다음
        </button>
      </div>
    </div>
  );
}

export default MedicineInfo;
