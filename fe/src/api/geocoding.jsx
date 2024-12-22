import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GeoCode = ({ address, userId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCoordinates = async address => {
    const googleApiKey = "AIzaSyAxDTxRV9M8ouOkdfODVpxsoi33BNO7iRk";
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${googleApiKey}`;

    try {
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        const location = data.results[0].geometry.location;

        // 백엔드로 데이터 전달
        await sendToBackend(address, location.lat, location.lng);

      } else {
        setError(`Geocoding API Error: ${data.status}`);
      }
    } catch (err) {
      setError("Failed to fetch geocoding data.");
    } finally {
      setLoading(false);
    }
  };

  const sendToBackend = async (userLocation, latitude, longitude) => {
    const backendUrl = `http://localhost:5000/user/${userId}/location`; // 백엔드 API 엔드포인트

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userLocation: userLocation,
          latitude: latitude,
          longitude: longitude,
        }),
      });

      if (!response.ok) {
        console.log(response.body);
        throw new Error("데이터 전송 실패");
      }

      console.log("데이터 전송 성공");
    } catch (err) {
      console.error("데이터 전송 오류:", err);
    }
  };

  useEffect(() => {
    if (address) {
      getCoordinates(address);
    }
  }, [address]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GeoCode;
