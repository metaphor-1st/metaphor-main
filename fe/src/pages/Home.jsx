import Header from "../components/header/header";
import StartButton from "../components/startButton/startButton";
import "./Home.css";
import drug from "../images/drug.svg";
import { useState, useEffect } from "react";

export default function Home() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // 사용자 정보 생성 요청
    const userData = {
      sex: "male",
      bornYear: "2002",
    };

    const createUser = async () => {
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

          setUserId(responseData.userId);
        }
        if (!response.ok) {
          throw new Error("사용자 정보를 생성하지 못했습니다.");
        }
      } catch (error) {
        console.error("Error creating user:", error);
      }
    };

    createUser();
    console.log(userId);
  }, []);
  return (
    <div className="HomeContainer">
      <Header />
      <p className="HomeCopyright">
        증상 기반 약과 위치 기반
        <br />
        약국을 추천해주는 요기약
      </p>
      <img className="DrugImg" src={drug}></img>
      <div className="ButtonContainer">
        <div style={{ paddingBottom: "5rem", width: "90%" }}>
          <StartButton type="medicine" />
          <StartButton type="pharmacy" userId={userId} />
        </div>
      </div>
    </div>
  );
}
