import React, { useEffect } from 'react';

const PharmacyMap = () => {
  useEffect(() => {
    // Load the Google Maps script when the component mounts
    const loadScript = (url) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
    };

    loadScript(
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyCDxwOQulU9kVdBPypTPaCQ4zQO4XT9-eU&libraries=places&callback=initMap'
    );

    // Initialize the map
    window.initMap = function () {
      const location = { lat: 37.543243408203125, lng: 126.95169830322266 }; // 공덕역
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 15,
      });

      const service = new window.google.maps.places.PlacesService(map);
      const request = {
        location: location,
        radius: 1000, // 1km radius
        type: ['pharmacy'], // Search for pharmacies
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          results.forEach((place) => {
            new window.google.maps.Marker({
              position: place.geometry.location,
              map: map,
              title: place.name,
            });
          });
        }
      });
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ height: '50rem', width: '100%' }}></div>
    </div>
  );
};

export default PharmacyMap;
