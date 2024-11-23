import Header from '../../components/header/header';
import ProgressBar from '../../components/progressBar/progressBar';
import { useNavigate } from 'react-router-dom';
import './locationInfo.css';

function LocationInfo() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/findMedicine');
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

      <div>
        <label className="AddressBarContainer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21.7662 20.589L16.7962 15.6189C18.1506 13.9624 18.8165 11.8487 18.6562 9.71506C18.4958 7.58137 17.5216 5.59092 15.9348 4.15543C14.3481 2.71993 12.2704 1.94922 10.1313 2.0027C7.9923 2.05618 5.95565 2.92977 4.44265 4.44277C2.92965 5.95577 2.05606 7.99242 2.00258 10.1315C1.9491 12.2705 2.71981 14.3483 4.15531 15.935C5.5908 17.5217 7.58125 18.496 9.71494 18.6563C11.8486 18.8166 13.9623 18.1507 15.6188 16.7963L20.5889 21.7664C20.7459 21.918 20.9562 22.002 21.1746 22.0001C21.3929 21.9982 21.6017 21.9106 21.7561 21.7562C21.9105 21.6018 21.998 21.393 21.9999 21.1747C22.0018 20.9564 21.9179 20.746 21.7662 20.589ZM10.3531 17.0144C9.03565 17.0144 7.74778 16.6238 6.65235 15.8918C5.55692 15.1599 4.70314 14.1195 4.19897 12.9024C3.6948 11.6852 3.56289 10.3458 3.81991 9.0537C4.07694 7.76156 4.71135 6.57464 5.64294 5.64306C6.57452 4.71148 7.76143 4.07706 9.05358 3.82003C10.3457 3.56301 11.6851 3.69492 12.9022 4.19909C14.1194 4.70326 15.1598 5.55705 15.8917 6.65247C16.6236 7.7479 17.0143 9.03578 17.0143 10.3532C17.0123 12.1193 16.3099 13.8124 15.0611 15.0612C13.8123 16.31 12.1192 17.0124 10.3531 17.0144Z"
              fill="#757575"
            />
          </svg>
          <text className="AddressBarText">서울 마포구 마포대로 100</text>
        </label>
      </div>
    </>
  );
}

export default LocationInfo;
