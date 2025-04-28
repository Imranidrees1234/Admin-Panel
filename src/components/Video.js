import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const Video = () => {
  const videoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);
  const [adminId] = useState("admin123");
  const [driverId, setDriverId] = useState("");

  useEffect(() => {
    socket.current = io("https://database-backend-production.up.railway.app/");

    socket.current.emit("register_admin", adminId);
    console.log(`📌 Admin registered: ${adminId}`);

    socket.current.on("receive_offer", async ({ signal, driverSocket }) => {
      console.log(`📡 Received WebRTC offer from Driver: ${driverSocket}`);

      peerConnection.current = new RTCPeerConnection();

      peerConnection.current.ontrack = (event) => {
        console.log("🎥 Receiving video stream...");
        videoRef.current.srcObject = event.streams[0];
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("📡 Sending ICE candidate to Driver...");
          socket.current.emit("send_ice_candidate", { candidate: event.candidate, driverSocket });
        }
      };

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal));
      
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      console.log("📡 Sending WebRTC answer to Driver...");
      socket.current.emit("send_answer", { signal: answer, driverSocket });
    });

    socket.current.on("receive_ice_candidate", ({ candidate }) => {
      console.log("📡 Received ICE candidate from Driver.");
      peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        console.log("❌ Admin disconnected.");
      }
    };
  }, [adminId]);

  const requestVideo = () => {
    if (!driverId) {
      alert("Enter Driver ID");
      return;
    }
    console.log(`📡 Requesting video from Driver ${driverId}`);
    socket.current.emit("request_video", { adminId, driverId });
  };

  return (
    <div>
      <h2>Admin Video Viewer</h2>
      <input
        type="text"
        placeholder="Enter Driver ID"
        value={driverId}
        onChange={(e) => setDriverId(e.target.value)}
      />
      <button onClick={requestVideo}>Request Video</button>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", border: "1px solid black" }} />
    </div>
  );
};

export default Video;




// // Admin Code (Video.js)
// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";

// const Video = () => {
//   const videoRef = useRef(null);
//   const peerConnection = useRef(null);
//   const socket = useRef(null);
//   const [adminId] = useState("admin123");
//   const [driverId, setDriverId] = useState("");
//   const [clientId, setClientId] = useState(null);

//   useEffect(() => {
//     socket.current = io("https://admin-backend-production-4ca3.up.railway.app/");

//     socket.current.emit("register_admin", adminId);
//     console.log(`📌 Admin registered: ${adminId}`);

//     socket.current.on("receive_offer", async ({ signal, driverSocket }) => {
//       console.log(`📡 Received WebRTC offer from Driver: ${driverSocket}`);

//       peerConnection.current = new RTCPeerConnection();

//       peerConnection.current.ontrack = (event) => {
//         console.log("🎥 Receiving video stream...", event.streams[0]);
//         if (videoRef.current) {
//           videoRef.current.srcObject = event.streams[0];
//         }
//       };
      

//       peerConnection.current.onicecandidate = (event) => {
//         if (event.candidate) {
//           console.log("📡 Sending ICE candidate to Driver...");
//           socket.current.emit("send_ice_candidate", { candidate: event.candidate, driverSocket });
//         }
//       };

//       await peerConnection.current.setRemoteDescription(new RTCSessionDescription(signal));
      
//       const answer = await peerConnection.current.createAnswer();
//       await peerConnection.current.setLocalDescription(answer);

//       console.log("📡 Sending WebRTC answer to Driver...");
//       socket.current.emit("send_answer", { signal: answer, driverSocket });
//     });

//     socket.current.on("receive_ice_candidate", ({ candidate }) => {
//       console.log("📡 Received ICE candidate from Driver.");
//       peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
//     });

//     socket.current.on("client_request_video", ({ clientId }) => {
//       setClientId(clientId);
//     });

//     return () => {
//       if (socket.current) {
//         socket.current.disconnect();
//         console.log("❌ Admin disconnected.");
//       }
//     };
//   }, [adminId]);

//   const requestVideo = () => {
//     if (!driverId) {
//       alert("Enter Driver ID");
//       return;
//     }
//     console.log(`📡 Requesting video from Driver ${driverId}`);
//     socket.current.emit("request_video", { adminId, driverId });
//   };

//   // const approveClientRequest = () => {
//   //   if (clientId && peerConnection.current) {
//   //     console.log(`✅ Approving request and sending video to client ${clientId}`);
//   //     socket.current.emit("approve_request_client", { clientId });
//   //   }
//   // };

// //   const approveClientRequest = async () => {
// //     if (clientId && peerConnection.current) {
// //         console.log(`✅ Approving request and sending video to client ${clientId}`);

// //         const clientPeerConnection = new RTCPeerConnection();

// //         // Send admin's video stream to the client
// //         peerConnection.current.getSenders().forEach((sender) => {
// //             clientPeerConnection.addTrack(sender.track, peerConnection.current.getRemoteStreams()[0]);
// //         });

// //         clientPeerConnection.onicecandidate = (event) => {
// //             if (event.candidate) {
// //                 console.log("📡 Sending ICE candidate to Client...");
// //                 socket.current.emit("send_ice_candidate_client", { candidate: event.candidate, clientId });
// //             }
// //         };

// //         const offer = await clientPeerConnection.createOffer();
// //         await clientPeerConnection.setLocalDescription(offer);

// //         console.log("📡 Sending WebRTC offer to Client...");
// //         socket.current.emit("send_offer_client", { signal: offer, clientId });
// //     }
// // };
// // const approveClientRequest = () => {
// //   if (clientId && peerConnection.current) {
// //     console.log(`✅ Approving request and sending video to client ${clientId}`);

// //     // Ensure the admin has a valid stream before proceeding
// //     if (!videoRef.current || !videoRef.current.srcObject) {
// //       console.error("🚨 No video stream available!");
// //       return;
// //     }

// //     const stream = videoRef.current.srcObject;
    
// //     stream.getTracks().forEach((track) => {
// //       console.log(`🎥 Adding track: ${track.kind}`);
// //       peerConnection.current.addTrack(track, stream);
// //     });

// //     socket.current.emit("approve_request_client", { clientId });
// //   }
// // };

// const approveClientRequest = () => {
//   if (clientId && peerConnection.current) {
//     console.log(`✅ Approving request and sending video to client ${clientId}`);

//     if (!videoRef.current || !videoRef.current.srcObject) {
//       console.error("🚨 No video stream available!");
//       return;
//     }

//     const stream = videoRef.current.srcObject;

//     // Get existing senders
//     const senders = peerConnection.current.getSenders().map(sender => sender.track);

//     stream.getTracks().forEach((track) => {
//       if (!senders.includes(track)) { // Only add if track is not already added
//         console.log(`🎥 Adding track: ${track.kind}`);
//         peerConnection.current.addTrack(track, stream);
//       } else {
//         console.log(`⚠️ Track ${track.kind} already added, skipping.`);
//       }
//     });

//     socket.current.emit("approve_request_client", { clientId });
//   }
// };



//   return (
//     <div>
//       <h2>Admin Video Viewer</h2>
//       <input
//         type="text"
//         placeholder="Enter Driver ID"
//         value={driverId}
//         onChange={(e) => setDriverId(e.target.value)}
//       />
//       <button onClick={requestVideo}>Request Video</button>
//       {clientId && <button onClick={approveClientRequest}>Approve Client Video</button>}
//       <video ref={videoRef} autoPlay playsInline style={{ width: "100%", border: "1px solid black" }} />
//     </div>
//   );
// };

// export default Video;
