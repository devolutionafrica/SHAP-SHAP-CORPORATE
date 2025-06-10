"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { Button } from "@mui/material";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView({
  longitude,
  latitude,
  onClose,
}: {
  longitude: number;
  latitude: number;
  onClose: any;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="justify-end">
        <Button onClick={() => onClose(false)}>Fermer Ma carte</Button>
      </div>
      <MapContainer
        center={[longitude, latitude]} // Exemple : Abidjan //[5.3599517, -4.0082563]
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[5.3599517, -4.0082563]}>
          <Popup>Abidjan, Côte d'Ivoire 🇨🇮</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
