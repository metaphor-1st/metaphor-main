import ProgressBar from "../../components/progressBar/progressBar";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import "./painInfo.css";
import Dropdown from "../../components/dropdown/Dropdown";
import SearchBar from "../../components/searchBar/SearchBar";
import { useState } from "react";

function PainInfo() {
  const [inputText, setInputText] = useState("");
  const [selectedPain, setSelectedPain] = useState("통증");
  const navigate = useNavigate();
  const userId = "1234";

  const handleClick = async () => {
    if (inputText.trim()) {
      const painData = {
        pain: selectedPain,
        description: inputText,
      };

      try {
        const response = await fetch(
          `http://localhost:4000/user/${userId}/pain`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(painData),
          }
        );

        if (response.ok) {

          navigate("/medicineInfo");
        } else {
          console.error("데이터 전송 실패");
        }
      } catch (error) {
        console.error("데이터 전송 중 오류!! : ", error);
      }
    }
  };
  const handleInputChange = value => {
    setInputText(value);
  };
  const handlePainSelect = (pain) => {
    setSelectedPain(pain);
  };
  return (
    <div>
      <Header />
      <div className="InfoWrap">
        <h1 className="StepTitle">어디가 불편하세요?</h1>
        <ProgressBar currentStep={1} />
      </div>
      <div className="PainInputWrap">
        <div style={{ padding: "1.25rem 0rem" }}>
          <text className="PainText">증상을 선택해주세요</text>
        </div>
        <Dropdown
          options={["복통", "두통", "호흡기질환"]}
          defaultValue={"통증"}
          onChange={handlePainSelect}
        />
      </div>
      <div className="PainInputWrap">
        <div style={{ padding: "1.25rem 0rem" }}>
          <text className="PainText">정확한 증상을 입력해주세요</text>
        </div>
        <SearchBar
          text={"머리가 지끈지끈 아파요"}
          onInputChange={handleInputChange}
        />
      </div>
      <button
        onClick={handleClick}
        className={`NextBtn ${!inputText.trim() ? "unselected" : ""}`}
        disabled={!inputText.trim()}>
        다음
      </button>
    </div>
  );
}

export default PainInfo;
