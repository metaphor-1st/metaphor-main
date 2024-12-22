import React, { useEffect, useCallback, useRef } from "react";

const PharmacyMap = ({ center }) => {
  const mapRef = useRef(null);

  const initMap = useCallback(() => {
    if (!center) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: 15,
      mapId: "c33ab4049d3aa7ca",
    });

    const mapPin = "../../cautionIcon.svg";

    // map1 마커만 생성
    const location = { title: "map1", position: center };

    new window.google.maps.Marker({
      map,
      position: location.position,
      title: location.title,
      icon: mapPin,
    });
  }, [mapRef]);

  useEffect(() => {
    initMap();
  }, [initMap]);

  return <div id="map" style={{ height: "50rem", width: "100%" }} ref={mapRef}></div>;
};

export default PharmacyMap;
