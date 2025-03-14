import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./startButton.css";
import selectedArrow from "../../images/selectedArrow.svg";
import unselectedArrow from "../../images/unselectedArrow.svg";

const StartButton = ({ type, isSelected, userId }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const buttonCaption = {
    medicine: {
      title: (
        <>
          <span className="highlight">필요한 약</span>
          <span>을 알고 싶어요</span>
        </>
      ),
      desc: (
        <>
          <span>
            구체적인 증상을 입력하면, 해당 증상에 가장 적합한
            <br />
          </span>
          <span> 약 정보를 알 수 있어요!</span>
        </>
      ),
      link: "/userInfo",
    },
    pharmacy: {
      title: (
        <>
          <span>바로 </span>
          <span className="highlight">약국을 찾고</span>
          <span>싶어요</span>
        </>
      ),
      desc: (
        <>
          <span>
            현재 위치를 기준으로
            <br />
          </span>
          <span> 근처 약국 정보를 알 수 있어요!</span>
        </>
      ),
      link: "/locationInfo",
    },
  };

  const currentButton = buttonCaption[type];

  const handleClick = () => {
    // userId가 존재하면 쿼리 매개변수로 추가
    if (userId) {
      navigate(`${currentButton.link}?userId=${userId}`);
    } else {
      navigate(currentButton.link); // userId가 없으면 기본 링크로 이동
    }
  };

  return (
    <button
      className="StartButtonContainer"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className="StartButtonText">
        <p className="StartButtonTitle">{currentButton.title}</p>
        <p className="StartButtonDesc">{currentButton.desc}</p>
      </div>
      <div className="ButtonArrow">
        <img
          src={isSelected || isHovered ? selectedArrow : unselectedArrow}
          alt="arrow"
        />
      </div>
    </button>
  );
};

export default StartButton;
