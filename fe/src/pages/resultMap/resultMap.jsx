import GoogleMap from "../../api/googleMap";
import Header from "../../components/header/header";
import { useState, useEffect } from "react";

import "./resultMap.css";

function ResultMap() {
  const [center, setCenter] = useState({ lat: 37.543243, lng: 126.951698 }); // 기본값: 공덕역
  const [error, setError] = useState(null);

   const fetchCoordinates = async () => {
    const backendUrl = "http://localhost:5000/map/pill";

    try {
      const response = await fetch(backendUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("데이터를 받지 못했습니다");
      }

      const data = await response.json();
      const { latitude, longitude } = data;

      if (latitude && longitude) {
        setCenter({ lat: latitude, lng: longitude }); // GoogleMap의 center로 설정
      } else {
        throw new Error("Invalid data received from backend");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCoordinates();
  }, []);

  return (
    <div>
      <Header />
      <div
        className="MapContainer"
        style={{ position: "relative", width: "100%" }}>
        <GoogleMap center={center}/>
      </div> {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default ResultMap;
