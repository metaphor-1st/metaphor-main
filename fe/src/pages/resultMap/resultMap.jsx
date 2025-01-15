import GoogleMap from "../../api/googleMap";
import Header from "../../components/header/header";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import "./resultMap.css";

function ResultMap() {
  const [center, setCenter] = useState(null); // 초기값을 null로 설정
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null);
  const location = useLocation();
  const userId = new URLSearchParams(location.search).get("userId");

  const fetchCoordinates = async () => {
    try {
      setLoading(true); // 로딩 시작

      const LocationData = JSON.parse(sessionStorage.getItem("LocationData"));
console.log(LocationData)
      const { lat, lng } = LocationData;

      if (lat && lng) {
        setCenter({ lat: lat, lng: lng }); // GoogleMap의 center로 설정
        console.log("Updated center:", { lat: lat, lng: lng });
      } else {
        throw new Error("Invalid data received from backend");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      console.log("로딩종료");
      setLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    fetchCoordinates();
  }, [userId]);

  return (
    <div>
      <Header />
      <div
        className="MapContainer"
        style={{ position: "relative", width: "100%" }}>
        {center ? (
          <GoogleMap center={center} />
        ) : (
          <p>지도를 표시할 수 없습니다.</p>
        )}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default ResultMap;
