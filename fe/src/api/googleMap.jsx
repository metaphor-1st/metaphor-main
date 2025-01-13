import React, { useRef, useEffect, useState, useCallback } from "react";
import "./googleMap.css"
import mapMarker from "../../src/images/mapMarker.svg";

const PharmacyMap = ({ center }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  const initMap = useCallback(() => {
    if (!center || !mapRef.current || !window.google || !window.google.maps) {
      setErrorMessage("Google Maps API 또는 center가 유효하지 않습니다.");
      console.error("Google Maps API 또는 center가 유효하지 않습니다.");
      return;
    }

    try {
      // 지도 초기화
      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 13,
      });
      mapInstanceRef.current = map;

      // PlacesService 초기화
      if (window.google.maps.places) {
        const service = new window.google.maps.places.PlacesService(map);
        const request = {
          location: center,
          radius: 5000, // 5km 반경으로 찾기
          type: "pharmacy", // 약국 찾기
        };

        service.nearbySearch(request, (results, status) => {
          console.log(results)
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const infoWindow = new window.google.maps.InfoWindow();

            results.forEach(place => {
              // 마커 추가
              const marker = new window.google.maps.Marker({
                map,
                position: place.geometry.location,
                title: place.name,
                icon: {
                  url: mapMarker, // 사용자 정의 마커 이미지
                  scaledSize: new window.google.maps.Size(40, 40), // 크기 조정
                },
              });

              // 마커 클릭 이벤트
              marker.addListener("click", () => {
                console.log("Marker clicked:", place.name);

                // 선택된 약국 정보 설정
                setSelectedPharmacy({
                  name: place.name,
                  rating: place.rating || "별점 없음",
                  vicinity: place.vicinity,
                });
                // InfoWindow에 정보 표시
                infoWindow.setContent(`
     <div class="InfoWindow">
      <h2>${place.name}</h2>
      <p><strong>Rating:</strong> ${place.rating || "별점 없음"}</p>
      <p><strong>Address:</strong> ${place.vicinity}</p>
    </div>
  `);
                infoWindow.open(map, marker);
              });
            });
          } else if (
            status ===
            window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
          ) {
            setErrorMessage("반경 5km 내 약국을 찾을 수 없습니다.");
            console.warn("No results found within the specified radius.");
          } else if (
            status ===
            window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT
          ) {
            setErrorMessage(
              "API 요청 한도를 초과했습니다. 나중에 다시 시도하세요."
            );
            console.error("API 요청 한도 초과:", status);
          } else if (
            status ===
            window.google.maps.places.PlacesServiceStatus.REQUEST_DENIED
          ) {
            setErrorMessage(
              "API 요청이 거부되었습니다. API 키 설정을 확인하세요."
            );
            console.error("API 요청 거부:", status);
          } else if (
            status ===
            window.google.maps.places.PlacesServiceStatus.INVALID_REQUEST
          ) {
            setErrorMessage("잘못된 요청입니다. 요청 매개변수를 확인하세요.");
            console.error("잘못된 요청:", status);
          } else {
            setErrorMessage(`PlacesService 오류: ${status}`);
            console.error(`PlacesService 오류: ${status}`);
          }
        });
      } else {
        setErrorMessage("Google Places API가 로드되지 않았습니다.");
        console.error("Google Places API가 로드되지 않았습니다.");
      }
    } catch (error) {
      setErrorMessage("맵 초기화 중 오류가 발생했습니다.");
      console.error("Error initializing map:", error);
    }
  }, [center]);

  useEffect(() => {
    if (window.google && window.google.maps) {
      if (mapRef.current && mapRef.current instanceof Element) {
        initMap();
      } else {
        console.error("mapRef가 유효한 DOM 요소로 초기화되지 않았습니다.");
      }
    } else {
      console.error("Google Maps API가 로드되지 않았습니다.");
    }
  }, [initMap]);

  return (
    <div style={{ height: "50rem", width: "100%" }} ref={mapRef}>
      {errorMessage && (
        <p style={{ color: "red", marginTop: "1rem" }}>{errorMessage}</p>
      )}
    </div>
  );
};

export default PharmacyMap;
