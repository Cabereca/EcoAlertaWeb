'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

// Corrigir os ícones do Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapComponentProps {
  value: { lat: number; lng: number };
  onChange: (location: { lat: number; lng: number }) => void;
}

// Componente para atualizar a visualização do mapa quando a posição mudar
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

// Componente para capturar eventos do mapa
function MapEvents({ onChange }: { onChange: (location: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click: (e) => {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function MapComponent({ value, onChange }: MapComponentProps) {
  // Definir valores padrão caso value seja undefined
  const defaultLat = -23.5505;
  const defaultLng = -46.6333;

  // Garantir que temos valores válidos para lat e lng
  const lat = value?.lat || defaultLat;
  const lng = value?.lng || defaultLng;

  const [position, setPosition] = useState<[number, number]>([lat, lng]);

  // Atualizar a posição quando o valor mudar
  useEffect(() => {
    if (value && typeof value.lat === 'number' && typeof value.lng === 'number') {
      setPosition([value.lat, value.lng]);
    }
  }, [value]);

  // Atualizar o valor quando a posição mudar
  const handlePositionChange = (location: { lat: number; lng: number }) => {
    setPosition([location.lat, location.lng]);
    onChange(location);
  };

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer attribution="Google Maps" url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}" />
      <ChangeView center={position} />
      <Marker position={position} icon={DefaultIcon} />
      <MapEvents onChange={handlePositionChange} />
    </MapContainer>
  );
}
