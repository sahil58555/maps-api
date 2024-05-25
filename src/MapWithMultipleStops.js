// src/MapWithMultipleStops.js
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZ2F1cmFnb3lhbDg0OTMiLCJhIjoiY2x3bG53MzFzMW56aDJqbnJ3ZzBzMnA0aSJ9.i9HsLPsxPVIiOi5ukLMhmQ';

const MapWithMultipleStops = ({ stops }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [stops[0].lng, stops[0].lat], // Initial center
      zoom: 5
    });

    const addRouteAndMarkers = async () => {
      const coordinates = stops.map(stop => `${stop.lng},${stop.lat}`).join(';');
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const data = await query.json();
      const route = data.routes[0].geometry;

      map.on('load', () => {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route
            }
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#888',
            'line-width': 8
          }
        });

        stops.forEach((stop, index) => {
          // Create a custom marker element
          const el = document.createElement('div');
          //el.className = 'custom-marker';
          el.innerHTML = `Stop ${index + 1}`;

          new mapboxgl.Marker(el)
            .setLngLat([stop.lng, stop.lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(`Stop ${index + 1}`))
            .addTo(map);
        });

        const bounds = new mapboxgl.LngLatBounds();
        route.coordinates.forEach(coord => {
          bounds.extend(coord);
        });
        map.fitBounds(bounds, {
          padding: { top: 20, bottom: 20, left: 20, right: 20 }
        });
      });
    };

    addRouteAndMarkers();

    return () => map.remove();
  }, [stops]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
};

export default MapWithMultipleStops;
