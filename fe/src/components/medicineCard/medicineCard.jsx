import "./medicineCard.css";

function MedicineCard({ name, kind, dose, pic }) {
  return (
    <div className="MedicineWrap">
      <div className="MedicineLine"></div>
      <div className="ImgBox">
        <img src={pic} alt="Medicine1"></img>
      </div>
      <div className="MedicineBox">
        <div className="MedicineName">{name}</div>
        
        <div className="MedicineContent">
          <div className="MedicineInfo">
            <div>약 종류</div>
            <div>복용량</div>
          </div>
          <div className="MedicineInfoText">
            <div>{kind}</div>
            <div>{dose}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineCard;
