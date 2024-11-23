import RightArrow from "../../images/rightArrow.svg";
import "./medicineCard.css";

function MedicineCard({ name, kind, dose, pic }) {
  return (
    <div className="MedicineWrap">
      <div className="ImgBox">
        <img src={pic} alt="Medicine1"></img>
      </div>
      <div className="MedicineBox">
        <div className="MedicineName">
          <div className="MedicineName">{name}</div>
          <img src={RightArrow}></img>
        </div>
        <div className="MedicineLine"></div>
        <div className="MedicineContent">
          <div className="MedicineKind">
            <div className="MedicineKind">약 종류</div>
            <div className="MedicineKind">{kind}</div>
          </div>
          <div className="MedicineDose">
            <div className="MedicineDose">복용량</div>
            <div className="MedicineDose">{dose}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineCard;
