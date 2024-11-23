import GoogleMap from '../api/googleMap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header/header';
import StartButton from '../components/startButton/startButton';
import './Home.css';
import drug from '../images/drug.svg';

export default function Home() {
  const navigate = useNavigate();

  const GoToMedicine = () => {
    navigate('/userInfo');
  };
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
        <div style={{ paddingBottom: '5rem', width: '90%' }}>
          <StartButton type="medicine" />
          <StartButton type="pharmacy" />
        </div>
      </div>
    </div>
  );
}
