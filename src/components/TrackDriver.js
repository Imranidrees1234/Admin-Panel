// import React, { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// const TrackDriver = () => {
//   const [driverLocations, setDriverLocations] = useState({});
//   const [autoClickTimeouts, setAutoClickTimeouts] = useState({});
//   const mapRef = useRef(null);
//   const markersRef = useRef({});
//   const socket = useRef(null);

//   useEffect(() => {
//     const mapContainer = document.getElementById("map");
//     if (!mapContainer) {
//       console.error("Map container not found!");
//       return;
//     }

//     const DefaultIcon = L.icon({
//       iconUrl: markerIcon,
//       shadowUrl: markerShadow,
//       iconSize: [25, 41],
//       iconAnchor: [12, 41],
//     });
//     L.Marker.prototype.options.icon = DefaultIcon;

//     if (!mapRef.current) {
//       mapRef.current = L.map("map").setView([0, 0], 10);
//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "© OpenStreetMap contributors",
//       }).addTo(mapRef.current);
//     }

//     socket.current = io("http://localhost:5000/");

//     socket.current.on("connect", () => {
//       console.log("Connected to WebSocket server");
//     });

//     socket.current.on("receive-location", (locations) => {
//       console.log("Updated Driver Locations:", locations);
//       setDriverLocations(locations);
//     });

//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (!mapRef.current) return;

//     Object.entries(driverLocations).forEach(([id, { latitude, longitude }]) => {
//       if (isNaN(latitude) || isNaN(longitude)) {
//         console.warn(`Skipping invalid coordinates for driver ${id}:`, latitude, longitude);
//         return;
//       }

//       console.log(`Driver ${id} updated position -> Latitude: ${latitude}, Longitude: ${longitude}`);
      
//       if (markersRef.current[id]) {
//         markersRef.current[id].setLatLng([latitude, longitude]);
//       } else {
//         markersRef.current[id] = L.marker([latitude, longitude], {
//           title: `Driver ID: ${id}`,
//         }).addTo(mapRef.current);
//       }
//     });

//     const latestDriver = Object.entries(driverLocations).pop();
//     if (latestDriver) {
//       const [, { latitude, longitude }] = latestDriver;
//       mapRef.current.setView([latitude, longitude], 14);
//     }
//   }, [driverLocations]);

//   // Forward location & auto-click after 1 second
//   const forwardLocationToClient = (driverId) => {
//     if (!driverId) return;
//     socket.current.emit("forward-location", { driverId });

//     // Set a timeout to auto-click after 1 second
//     const timeoutId = setTimeout(() => {
//       document.getElementById(`send-client-${driverId}`).click();
//     }, 1000);

//     // Store the timeout ID in state
//     setAutoClickTimeouts((prevTimeouts) => ({
//       ...prevTimeouts,
//       [driverId]: timeoutId,
//     }));
//   };

//   // Stop the auto-click function
//   const stopAutoClick = (driverId) => {
//     if (autoClickTimeouts[driverId]) {
//       clearTimeout(autoClickTimeouts[driverId]);

//       // Remove the timeout ID from state
//       setAutoClickTimeouts((prevTimeouts) => {
//         const updatedTimeouts = { ...prevTimeouts };
//         delete updatedTimeouts[driverId];
//         return updatedTimeouts;
//       });

//       console.log(`Auto-click stopped for driver ${driverId}`);
//     }
//   };

//   // const sendTwilioMessage = async () => {
//   //   try {
//   //     const response = await fetch("https://loyal-achievement-production.up.railway.app/send-message", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ link: "https://admin-app-psi-five.vercel.app/td" }),
//   //     });
//   //     const data = await response.json();
//   //     if (data.success) {
//   //       console.log("Message sent successfully:", data.messageSid);
//   //     } else {
//   //       console.error("Error sending message:", data.error);
//   //     }
//   //   } catch (error) {
//   //     console.error("Network error:", error);
//   //   }
//   // };

//   return (
//     <div style={{ padding: "20px", fontSize: "18px" }}>
//       <h2>Driver Live Location Updates</h2>
//       {Object.keys(driverLocations).length === 0 ? (
//         <p>No drivers currently online.</p>
//       ) : (
//         <ul>
//           {Object.entries(driverLocations).map(([id, { latitude, longitude }]) => (
//             <li key={id}>
//               <strong>Driver ID:</strong> {id} <br />
//               <strong>Latitude:</strong> {latitude} <br />
//               <strong>Longitude:</strong> {longitude} <br />
//               <button id={`send-client-${id}`} onClick={() => forwardLocationToClient(id)}>
//                 Send to Client
//               </button>
//               <button
//                 onClick={() => stopAutoClick(id)}
//                 style={{ marginLeft: "10px", padding: "5px 10px", backgroundColor: "red", color: "white" }}
//               >
//                 Stop Auto Click
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* <div style={{ textAlign: "center", margin: "20px 0" }}>
//         <button onClick={sendTwilioMessage} style={{ padding: "10px 20px", fontSize: "16px" }}>
//           Send WhatsApp Notification
//         </button>
//       </div> */}

//       <div id="map" style={{ height: "60vh", width: "100%", marginTop: "20px" }} />
//     </div>
//   );
// };

// export default TrackDriver;












// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// const TrackDriver = () => {
//     const [socket, setSocket] = useState(null);
//     const [requests, setRequests] = useState([]);
//     const adminId = "admin-123"; // Unique Admin ID

//     useEffect(() => {
//         const newSocket = io("ws://localhost:5005/admin"); // Connect to Admin Namespace

//         newSocket.on("connect", () => {
//             console.log("✅ Admin connected to WebSocket Server");
//             newSocket.emit("registerAdmin", adminId); // Register as Admin
//         });

//         newSocket.on("locationRequest", (data) => {
//             console.log("📍 Location request received:", data.clientId);
//             setRequests((prevRequests) => [...prevRequests, data.clientId]);
//         });

//         newSocket.on("disconnect", () => {
//             console.log("❌ Disconnected from WebSocket Server");
//         });

//         setSocket(newSocket);

//         return () => {
//             newSocket.disconnect();
//         };
//     }, []);

//     const handleResponse = (clientId, action) => {
//         if (socket) {
//             const eventType = action === "approve" ? "approveRequest" : "denyRequest";
//             socket.emit(eventType, { clientId });
//             setRequests((prevRequests) => prevRequests.filter((id) => id !== clientId));
//         }
//     };

//     return (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//             <h2>Admin Dashboard</h2>
//             {requests.length > 0 ? (
//                 requests.map((clientId) => (
//                     <div key={clientId} style={{ marginBottom: "10px", padding: "10px", border: "1px solid black" }}>
//                         <p>Client {clientId} requested location access.</p>
//                         <button onClick={() => handleResponse(clientId, "approve")}>✅ Approve</button>
//                         <button onClick={() => handleResponse(clientId, "deny")} style={{ marginLeft: "10px", background: "red", color: "white" }}>
//                             ❌ Deny
//                         </button>
//                     </div>
//                 ))
//             ) : (
//                 <p>No pending requests</p>
//             )}
//         </div>
//     );
// };

// export default TrackDriver;















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
    // const SERVER_URL = "ws://http://localhost:5005/"; // Change this to your Railway deployment URL in production
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

    adminSocket.current.on("locationRequest", (data) => {
      console.log("📍 Location request received:", data.clientId);
      setRequests((prevRequests) => [...prevRequests, data.clientId]);
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

  const handleResponse = (clientId, action) => {
    if (adminSocket.current) {
      const eventType = action === "approve" ? "approveRequest" : "denyRequest";
      adminSocket.current.emit(eventType, { clientId });
      setRequests((prevRequests) => prevRequests.filter((id) => id !== clientId));
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
      {requests.length > 0 ? (
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
      )}

      <div id="map" style={{ height: "60vh", width: "100%", marginTop: "20px" }} />
    </div>
  );
};

export default TrackDriver;

