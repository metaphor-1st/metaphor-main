import GoogleMap from '../../api/googleMap';
import Header from '../../components/header/header';
import drugImg from '../../images/타이레놀.png';
import './resultMap.css';

function ResultMap() {
  const drugName = '타이레놀';
  const DrugImg = drugImg;
  const Stock = '20개';
  const DrugType = '진통제';
  const Dosage = '1회 1정';

  return (
    <div>
      <Header />
      <div className="MapContainer" style={{ position: 'relative', width: '100%' }}>
        <GoogleMap />
        <div className="ResultCard">
          <div className="ImageRect">
            <img src={DrugImg} alt="DrugImg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultMap;
