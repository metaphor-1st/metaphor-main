import Header from "../components/header/header";
import StartButton from "../components/startButton/startButton";
import "./Home.css";
import drug from "../images/drug.svg";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // 세션 스토리지 클리어
    sessionStorage.clear();
  }, []);

  return (
    <div className="HomeContainer">
      <Header />
      <p className="HomeCopyright">
        증상 기반 약과 위치 기반
        <br />
        약국을 추천해주는 요기약
      </p>
      <img className="DrugImg" src={drug} alt="Drug" />
      <div className="ButtonContainer">
        <StartButton type="medicine" />
        <StartButton type="pharmacy" />
      </div>
    </div>
  );
}
