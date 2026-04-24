import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in React
import markerIconPng from "leaflet/dist/images/marker-icon.png";

const icon = new L.Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const FooterMap = () => {
  const position = [27.7099864, 85.2750758]; // your location

  return (
    <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100">
      <MapContainer
        center={position}
        zoom={16}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position} icon={icon}>
          <Popup>📍 Radhana Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default FooterMap;