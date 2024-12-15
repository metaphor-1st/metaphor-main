import Header from "../../components/header/header";
import ProgressBar from "../../components/progressBar/progressBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import searchIcon from "../../images/searchIcon.svg";
import "./locationInfo.css";

function LocationInfo() {
  const navigate = useNavigate();
  const [showDaumAddress, setShowDaumAddress] = useState(false);
  const [address, setAddress] = useState(""); 
  const [zonecode, setZonecode] = useState(""); 

  const toggleDaumAddressOpen = () => {
    setShowDaumAddress(true);
  };

  const handleComplete = data => {
    // console.log(data);
    setAddress(data.address); 
    setZonecode(data.zonecode); 
    setShowDaumAddress(false); 
  };

  const handleClick = () => {
    navigate("/findMedicine");
  };
  return (
    <>
      <Header />
      <div className="InfoWrap">
        <h1 className="StepTitle">위치를 입력해주세요</h1>
        <ProgressBar currentStep={3} />
        <button onClick={handleClick} className="NextBtn">
          다음
        </button>
      </div>

      <button className="AddressSearch" onClick={toggleDaumAddressOpen}>
        <img src={searchIcon} alt="searchIcon" />
        <span className="AddressText" style={{ color: address ? "#000" : "#767676" }}>{address ? `${address} (${zonecode})` : "주소를 입력해주세요!"}</span>
      </button>
      {showDaumAddress && (
        <div className="ModalOverlay">
          <div className="ModalContent">
            <DaumPostcode onComplete={handleComplete} />
          </div>
        </div>
      )}
    </>
  );
}

export default LocationInfo;
