import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, LoadScript  } from "@react-google-maps/api";

const PharmacyMap = ({ center }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const serviceRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  const initMap = useCallback(async () => {
    if (!center) return;

    try {
      if (!mapInstanceRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: center,
          zoom: 15,
          mapId: "c33ab4049d3aa7ca",
        });

        mapInstanceRef.current = map;

        const mapPin = "../../cautionIcon.svg";
        new window.google.maps.Marker({
          map,
          position: center,
          title: "Pharmacy Location",
          icon: mapPin,
        });

        serviceRef.current = new window.google.maps.places.PlacesService(map);

        searchNearbyPharmacies(center);
      } else {
        mapInstanceRef.current.setCenter(center);
        searchNearbyPharmacies(center);
      }
    } catch (error) {
      console.error("맵 로드 / 마커 오류:", error);
      setErrorMessage("맵 로드에 실패했습니다.");
    }
  }, [center]);

  const searchNearbyPharmacies = useCallback(location => {
    if (!serviceRef.current || !location) return;

    const request = {
      location: location,
      radius: 5000,
      type: ["pharmacy"],
    };

    serviceRef.current.nearbySearch(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        results.forEach(place => {
          try {
            new window.google.maps.Marker({
              map: mapInstanceRef.current,
              position: place.geometry.location,
              title: place.name,
            });
          } catch (markerError) {
            console.error(
              "마커 찍기 실패 :",
              place.name,
              markerError
            );
          }
        });
      } else if (
        status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
      ) {
        setErrorMessage("반경 1km에 약국이 없습니다.");
        console.warn("반경 1km에 약국이 없습니다.");
      } else if (
        status === window.google.maps.places.PlacesServiceStatus.INVALID_REQUEST
      ) {
        setErrorMessage("요청 오류 : 위치나 props를 확인해주세요");
        console.error(
          "요청 오류 : 위치나 props를 확인해주세요"
        );
      } else {
        setErrorMessage(
          "Fetch 오류"
        );
        console.error("Fetch 오류:", status);
      }
    });
  }, []);

  useEffect(() => {
    initMap();
  }, [initMap]);

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}>
      <div>
        <div
          id="map"
          style={{ height: "50rem", width: "100%" }}
          ref={mapRef}></div>
        {errorMessage && (
          <p style={{ color: "red", marginTop: "1rem" }}>{errorMessage}</p>
        )}
      </div>
    </LoadScript>
  );
};

export default PharmacyMap;
