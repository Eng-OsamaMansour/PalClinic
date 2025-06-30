import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* click-to-pick handler */
function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });
  return null;
}

export default function MapPicker({ lat, lon, onPick }) {
  const mapRef = useRef(null);

  const handleReady = (map) => {
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 0);
  };

  useEffect(() => {
    const invalidate = () => mapRef.current?.invalidateSize();
    window.addEventListener("resize", invalidate);
    window.addEventListener("scroll", invalidate, true); 
    return () => {
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("scroll", invalidate, true);
    };
  }, []);

  useEffect(() => {
    if (lat && lon && mapRef.current) {
      mapRef.current.setView([lat, lon]);
    }
  }, [lat, lon]);

  const wrapper = {
    width: "100%",
    height: 320,
    borderRadius: 8,
    overflow: "hidden",
    background: "#E6F0FA",       
  };

  return (
    <div style={wrapper}>
      <MapContainer
        center={[lat || 31.9522, lon || 35.2332]}
        zoom={13}
        whenCreated={handleReady}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        {lat && lon && <Marker position={[lat, lon]} />}
        <ClickHandler onPick={onPick} />
      </MapContainer>
    </div>
  );
}
