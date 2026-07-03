import React, {useCallback, useEffect, useState} from 'react';
import ReactPlayer from 'react-player';
import { useSocket } from '../Context/SocketProvider';
import peer from "../Service/Peer";

const Room = () => {
    const socket = useSocket();
    const [remoteSocketId,setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState(null);

    const handleCallUser = useCallback(async()=>{
        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        });
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId,offer});
        setMyStream(stream);
    },[remoteSocketId, socket]);

    const handleUserJoined = useCallback(({email,id})=>{
        console.log(`Email ${email} joined room`);
        setRemoteSocketId(id);
    },[]);

    const handleIncommingCall = useCallback(async ({from , offer})=>{
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        });
        setMyStream(stream);
        console.log("called from",from,offer);
        const ans = await peer.getAnswer(offer);
        socket.emit("call:accepted", {to: from, ans});
    },[socket]);

    const handleCallAccepted = useCallback(({from,ans})=>{
        peer.setLocalDescription(ans);
        console.log("Call Accepted");
    },[]);

    useEffect(()=>{
        socket.on("user:joined",handleUserJoined );
        socket.on("incomming:call",handleIncommingCall );
        socket.on("call:accepted",handleCallAccepted );

        return () =>{
            socket.off("user:joined",handleUserJoined );
            socket.off("incomming:call",handleIncommingCall );
            socket.off("call:accepted",handleCallAccepted );
        }
    },[socket,handleUserJoined,handleIncommingCall,handleCallAccepted]);

  return (
    <div>
        <h1>Room page</h1>
        <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
        {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
        {   myStream && 
            <>
                <h1>My Stream</h1>
                <video
                    ref={(video) => {
                        if (video && myStream) {
                        video.srcObject = myStream;
                        }
                    }}
                    autoPlay
                    playsInline
                    muted
                    width="300"
                    height="500"
                />
            </>
                
        }
    </div>
  )
}

export default Room