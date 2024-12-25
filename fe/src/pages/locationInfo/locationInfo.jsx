import Header from "../../components/header/header";
import ProgressBar from "../../components/progressBar/progressBar";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import searchIcon from "../../images/searchIcon.svg";
import GeoCode from "../../api/geocoding";
import "./locationInfo.css";

function LocationInfo() {
  const navigate = useNavigate();
  const [showDaumAddress, setShowDaumAddress] = useState(false);
  const [address, setAddress] = useState("");
  const [zonecode, setZonecode] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get("userId");

  const toggleDaumAddressOpen = () => {
    setShowDaumAddress(true);
  };

  const handleComplete = data => {
    setAddress(data.address);
    setZonecode(data.zonecode);
    setShowDaumAddress(false);
  };

  const handleCoordinatesUpdate = (latitude, longitude) => {
    setCoordinates({ latitude, longitude });
  };

  const handleClick = async () => {
    if (!userId) {
      console.error("userId가 설정되지 않았습니다.");
      return;
    }
   
    if (coordinates) {
      navigate(`/resultMap?userId=${userId}`, { state: { ...coordinates } });
    } else {
      console.error("위치 정보가 설정되지 않았습니다.");
    }

    if (address) {
      const userLocation = coordinates;

      try {
        const response = await fetch(
          `http://localhost:4000/user/${userId}/location`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userLocation), // JSON 데이터 전송
          }
        );

        if (response.ok) {
           console.log(userId)
        } else {
          console.error("데이터 전송 실패");
        }
      } catch (error) {
        console.error("데이터 전송 중 오류!! : ", error);
      }
    } else {
      console.log("입력값이 비어 있습니다.");
    }
  };

  return (
    <>
      <Header />
      <div className="InfoWrap">
        <h1 className="StepTitle">위치를 입력해주세요</h1>
        <button onClick={handleClick} className="NextBtn">
          다음
        </button>
      </div>

      <button className="AddressSearch" onClick={toggleDaumAddressOpen}>
        <img src={searchIcon} alt="searchIcon" />
        <span
          className="AddressText"
          style={{ color: address ? "#000" : "#767676" }}>
          {address ? `${address} (${zonecode})` : "주소를 입력해주세요!"}
        </span>
      </button>
      {showDaumAddress && (
        <div className="ModalOverlay">
          <div className="ModalContent">
            <DaumPostcode onComplete={handleComplete} />
          </div>
        </div>
      )}
      <GeoCode
        address={address}
        userId={userId}
        onCoordinatesUpdate={handleCoordinatesUpdate}
      />
    </>
  );
}

export default LocationInfo;
