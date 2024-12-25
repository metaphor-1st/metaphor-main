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
    const backendUrl = `http://localhost:4000/user/${userId}/location`;

    try {
      setLoading(true); // 로딩 시작
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
        console.log("Updated center:", { lat: latitude, lng: longitude });
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
        {loading ? <p>Loading map...</p> : <GoogleMap center={center} />}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default ResultMap;
