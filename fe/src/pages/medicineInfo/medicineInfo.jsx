import ProgressBar from "../../components/progressBar/progressBar";
import { useNavigate,useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/header/header";
import SearchBar from "../../components/searchBar/SearchBar";
import "./medecineInfo.css";
function MedicineInfo() {
  const [selectedBoolean, setSelectedBoolean] = useState(null);
  const [inputText, setInputText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get("userId");

  
  const handleClick = async () => {
    if (inputText.trim() || selectedBoolean === "no") {
      const mediData = {
        mediTF: selectedBoolean === "yes",
        description: inputText || "복용 중인 약물 없음", 
      };
      
      console.log("전송할 데이터(medicineData):", mediData);
      sessionStorage.setItem('medicineData', JSON.stringify(mediData));   //클라이언트사이드 세션에 저장
     
      try {
        const response = await fetch(
          `http://localhost:4000/user/${userId}/pain/medi`, 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              mediTF: mediData.mediTF,
              taken_medi: mediData.mediTF ? mediData.description : null,
            }), 
          }
        );
  
        if (response.ok) {

          console.log("데이터 전송 성공:", mediData);
          navigate("/findMedicine"); // 다음 페이지로 이동
        } else {
          // console.error("데이터 전송 실패");
        }
      } catch (error) {
        console.error("데이터 전송 중 오류!! : ", error);
      }
    } else {
      console.log("입력값이 비어 있습니다.");
    }

  };
  

  const handleBtnSelect = boolean => {
    setSelectedBoolean(boolean);
  };

  const handleInputChange = value => {
    setInputText(value);
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
            <h1 className="HiddenSubTitle">어떤 약을 복용 중이신가요?</h1>
            <SearchBar
              text={"어떤 종류의 약인지 입력해주세요 ex)항우울제"}
              onInputChange={handleInputChange}
            />
          </div>
        )}
       <button
  onClick={handleClick}
  className={`NextBtn ${
    (selectedBoolean === "yes" && !inputText.trim()) || !selectedBoolean ? "unselected" : ""
  }`}
  disabled={(selectedBoolean === "yes" && !inputText.trim()) || !selectedBoolean}>
  다음
</button>

      </div>
    </div>
  );
}

export default MedicineInfo;
