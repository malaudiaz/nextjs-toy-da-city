'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const defaultIcon = new L.Icon({
  iconUrl: '/marked-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapComponentProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialPosition: [number, number] | null;
}

const MapComponent = ({ onLocationChange, initialPosition }: MapComponentProps) => {
  const LocationMarker = () => {
    const [position, setPosition] = useState<[number, number] | null>(initialPosition);
    const map = useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationChange(e.latlng.lat, e.latlng.lng);
      },
      locationfound(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationChange(e.latlng.lat, e.latlng.lng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    // useEffect corregido sin dependencia innecesaria
    useEffect(() => {
      if (initialPosition) {
        setPosition(initialPosition);
        map.flyTo(initialPosition, 13);
      }
    }, [map]); // Solo map como dependencia

    const handleDragEnd = (e: L.DragEndEvent) => {
      const marker = e.target;
      const newPos = marker.getLatLng();
      setPosition([newPos.lat, newPos.lng]);
      onLocationChange(newPos.lat, newPos.lng);
    };

    return position === null ? null : (
      <Marker
        position={position}
        icon={defaultIcon}
        draggable={true}
        eventHandlers={{ dragend: handleDragEnd }}
      >
        <Popup>Tu ubicación seleccionada</Popup>
      </Marker>
    );
  };

  return (
    <div className="h-[400px] w-full">
      <MapContainer
        center={[40.416775, -3.703790]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapComponent;