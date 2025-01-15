import React, { useState, useEffect } from "react";

const GeoCode = ({ address, onCoordinatesUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const getCoordinates = async address => {
    const googleApiKey = process.env.REACT_APP_GEOCODE_API_KEY;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${googleApiKey}`;

    try {
      setLoading(true);
      const response = await fetch(url);
      const data = await response.json();
     

      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        console.log("Coordinates:", location);
        sessionStorage.setItem('LocationData', JSON.stringify(location));   //클라이언트사이드 세션에 저장
        onCoordinatesUpdate(location.lat, location.lng);
        return; // 성공 시 실행 종료

      } else {
        setError(`Geocoding API Error: ${data.status}`);
      }
    } catch (err) {
      console.error("Error caught in catch block:", err);
      setError("Failed to fetch geocoding data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      getCoordinates(address);
    }
  }, [address]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default GeoCode;
