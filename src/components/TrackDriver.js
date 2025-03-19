import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const TrackDriver = () => {
  const [driverLocations, setDriverLocations] = useState({});
  const [autoClickTimeouts, setAutoClickTimeouts] = useState({});
  const [requests, setRequests] = useState([]);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const socket = useRef(null);
  const adminSocket = useRef(null);
  const adminId = "admin-123"; // Unique Admin ID

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) {
      console.error("Map container not found!");
      return;
    }

    const DefaultIcon = L.icon({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([0, 0], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    // socket.current = io("http://localhost:5000/");
    // adminSocket.current = io("ws://localhost:5005/admin");
    // const SERVER_URL = "ws://https://admin-backend-production-4ca3.up.railway.app/"; // Change this to your Railway deployment URL in production
socket.current = io("https://livelocation-backend-production.up.railway.app/");
adminSocket.current = io("https://admin-backend-production-4ca3.up.railway.app/admin");

    socket.current.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    adminSocket.current.on("connect", () => {
      console.log("✅ Admin connected to WebSocket Server");
      adminSocket.current.emit("registerAdmin", adminId);
    });

    socket.current.on("receive-location", (locations) => {
      console.log("Updated Driver Locations:", locations);
      setDriverLocations(locations);
    });

    // adminSocket.current.on("locationRequest", (data) => {
    //   console.log("📍 Location request received:", data.clientId);
    //   setRequests((prevRequests) => [...prevRequests, data.clientId]);
    // });
    adminSocket.current.on("locationRequest", (data) => {
      console.log(`📍 Location request received from ${data.clientEmail}`);
      
      // Store request with email
      setRequests((prevRequests) => [...prevRequests, {clientEmail: data.clientEmail }]);
  });
  

    return () => {
      socket.current.disconnect();
      adminSocket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    Object.entries(driverLocations).forEach(([id, { latitude, longitude }]) => {
      if (isNaN(latitude) || isNaN(longitude)) {
        console.warn(`Skipping invalid coordinates for driver ${id}:`, latitude, longitude);
        return;
      }

      console.log(`Driver ${id} updated position -> Latitude: ${latitude}, Longitude: ${longitude}`);
      
      if (markersRef.current[id]) {
        markersRef.current[id].setLatLng([latitude, longitude]);
      } else {
        markersRef.current[id] = L.marker([latitude, longitude], {
          title: `Driver ID: ${id}`,
        }).addTo(mapRef.current);
      }
    });

    const latestDriver = Object.entries(driverLocations).pop();
    if (latestDriver) {
      const [, { latitude, longitude }] = latestDriver;
      mapRef.current.setView([latitude, longitude], 14);
    }
  }, [driverLocations]);

  const forwardLocationToClient = (driverId) => {
    if (!driverId) return;
    socket.current.emit("forward-location", { driverId });

    const timeoutId = setTimeout(() => {
      document.getElementById(`send-client-${driverId}`).click();
    }, 1000);

    setAutoClickTimeouts((prevTimeouts) => ({
      ...prevTimeouts,
      [driverId]: timeoutId,
    }));
  };

  const stopAutoClick = (driverId) => {
    if (autoClickTimeouts[driverId]) {
      clearTimeout(autoClickTimeouts[driverId]);
      setAutoClickTimeouts((prevTimeouts) => {
        const updatedTimeouts = { ...prevTimeouts };
        delete updatedTimeouts[driverId];
        return updatedTimeouts;
      });
      console.log(`Auto-click stopped for driver ${driverId}`);
    }
  };

  const handleResponse = (clientEmail, action) => {
  if (adminSocket.current) {
    const eventType = action === "approve" ? "approveRequest" : "denyRequest";
    console.log(`📤 Emitting ${eventType} for ${clientEmail}`);
    adminSocket.current.emit(eventType, { clientEmail });

    setRequests((prevRequests) => prevRequests.filter((req) => req.clientEmail !== clientEmail));
  }
};

  

  return (
    <div style={{ padding: "20px", fontSize: "18px" }}>
      <h2>Driver Live Location Updates</h2>
      {Object.keys(driverLocations).length === 0 ? (
        <p>No drivers currently online.</p>
      ) : (
        <ul>
          {Object.entries(driverLocations).map(([id, { latitude, longitude }]) => (
            <li key={id}>
              <strong>Driver ID:</strong> {id} <br />
              <strong>Latitude:</strong> {latitude} <br />
              <strong>Longitude:</strong> {longitude} <br />
              <button id={`send-client-${id}`} onClick={() => forwardLocationToClient(id)}>
                Send to Client
              </button>
              <button
                onClick={() => stopAutoClick(id)}
                style={{ marginLeft: "10px", padding: "5px 10px", backgroundColor: "red", color: "white" }}
              >
                Stop Auto Click
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>Admin Dashboard</h2>
      {/* {requests.length > 0 ? (
        requests.map((clientId) => (
          <div key={clientId} style={{ marginBottom: "10px", padding: "10px", border: "1px solid black" }}>
            <p>Client {clientId} requested location access.</p>
            <button onClick={() => handleResponse(clientId, "approve")}>✅ Approve</button>
            <button onClick={() => handleResponse(clientId, "deny")} style={{ marginLeft: "10px", background: "red", color: "white" }}>
              ❌ Deny
            </button>
          </div>
        ))
      ) : (
        <p>No pending requests</p>
      )} */}

{requests.length > 0 ? (
  requests.map(({ clientEmail }) => (
    <div key={clientEmail} style={{ marginBottom: "10px", padding: "10px", border: "1px solid black" }}>
      <p>Client: {clientEmail} requested location access.</p>
      <button onClick={() => handleResponse(clientEmail, "approve")}>✅ Approve</button>
      <button onClick={() => handleResponse(clientEmail, "deny")} style={{ marginLeft: "10px", background: "red", color: "white" }}>
        ❌ Deny
      </button>
    </div>
  ))
) : (
  <p>No pending requests</p>
)}


      <div id="map" style={{ height: "60vh", width: "100%", marginTop: "20px" }} />
    </div>
  );
};

export default TrackDriver;

