import ProgressBar from "../../components/progressBar/progressBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Dropdown from "../../components/dropdown/Dropdown";
import "./userInfo.css";

import WImg from "../../images/womanImg.svg";
import MImg from "../../images/manImg.svg";

function UserInfo() {
  const navigate = useNavigate();
  const [selectedSex, setSelectedSex] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null); // 기본값을 null로 설정

  const handleSexSelect = (sex) => {
    setSelectedSex(sex);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleClick = async () => {
    if (!selectedYear) return; // 선택된 연도가 없으면 실행하지 않음

    const userData = {
      sex: selectedSex,
      bornYear: selectedYear,
    };

    try {
      const response = await fetch("http://localhost:4000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const responseData = await response.json(); // 서버에서 받은 데이터
        sessionStorage.setItem("userData", JSON.stringify(responseData));
        const userId = responseData.userId; // 응답에 userId 포함
        navigate(`/painInfo?userId=${userId}`); // userId를 URL로 전달
      } else {
        console.error("데이터 전송 실패");
      }
    } catch (error) {
      console.error("데이터 전송 중 오류!! : ", error);
    }
  };

  const createAge = () => {
    return Array.from({ length: 2024 - 1920 + 1 }, (_, index) =>
      (2024 - index).toString()
    );
  };

  return (
    <div>
      <Header />
      <div className="InfoWrap">
        <h1 className="StepTitle">기본 정보를 입력해주세요</h1>
        <ProgressBar currentStep={0} />
        <h1 className="SubTitle">성별을 입력해주세요</h1>
        <div className="SexBtnWrap">
          <button
            className={`SexBtn ${selectedSex === "female" ? "selected" : ""}`}
            onClick={() => handleSexSelect("female")}>
            <img src={WImg} alt="woman" />
            여성
          </button>
          <button
            className={`SexBtn ${selectedSex === "male" ? "selected" : ""}`}
            onClick={() => handleSexSelect("male")}>
            <img src={MImg} alt="man" />
            남성
          </button>
        </div>
        <h1 className="SubTitle">태어난 년도를 입력해주세요</h1>
        <div className="AgeDropDown">
          <Dropdown
            options={createAge()}
            defaultValue="연도 선택하기"
            onChange={handleYearChange}
          />
        </div>

        <button
          onClick={handleClick}
          disabled={!selectedYear || !selectedSex} // 기본값이거나 선택되지 않으면 버튼 비활성화
          className={`NextBtn ${
            !selectedYear || !selectedSex ? "unselected" : ""
          }`}>
          다음
        </button>
      </div>
    </div>
  );
}

export default UserInfo;
