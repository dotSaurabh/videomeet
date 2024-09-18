import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider'
import ReactPlayer from 'react-player'
import peer from '../services/Peer'


function Room() {
    const socket  = useSocket()
    const [remoteSocketId , setRemoteSocketId] = useState(null)
    const [myStream , setMyStream ] = useState()
    const [remoteStream, setRemoteStream ] = useState()


    const handleUserjoined = useCallback(({email , id}) =>{
        console.log(`the email is ${email}`);
        setRemoteSocketId(id) 
     }
    ,[])

    const handleCallUser = useCallback(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video : true
      })
      const offer = await peer.getOffer();
      socket.emit('user:call', { to: remoteSocketId, offer });
      setMyStream(stream)
    },[remoteSocketId , socket])

    const handleIncommingCall = useCallback(async ({from , offer} ) => {
      setRemoteSocketId(from)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video : true
      })
      setMyStream(stream)
      console.log(`Incoming call` , from ,offer);
      const ans = await peer.getAnwer(offer)

      socket.emit("call:accepted",{to : from , ans})
    },[socket])


    const sendStream = useCallback(() => {
      for (const track of myStream.getTracks()){
        peer.peer.addTrack(track , myStream)
        }
    },[myStream])


    const handleCallAccepted = useCallback(async ({from , ans}) => {
         peer.setLocalDescription(ans)
         console.log("call Accepted");
        sendStream()
         
    },[sendStream])


    const handleNegoNeeded = useCallback(async () => {
      const offer = await peer.getOffer()
      socket.emit("peer:nego:needed",{offer,to: remoteSocketId})
    },[remoteSocketId ,socket])
    

    useEffect(( ) => {
      peer.peer.addEventListener("negotiationneeded",handleNegoNeeded)
      return () => {
        peer.peer.removeEventListener("negotiationneeded",handleNegoNeeded)
      }
    },[handleNegoNeeded])


    const handleNegoNeedIncomming = useCallback(
      async ({ from, offer }) => {
        const ans = await peer.getAnwer(offer);
        socket.emit("peer:nego:done", { to: from, ans });
      },
      [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
      await peer.setLocalDescription(ans);
      console.log('the final step is working ');
    }, []);


    useEffect(() => {
      peer.peer.addEventListener('track',async ev => {
        const remoteStream = ev.streams
        console.log("GOT TRACKS!!");
        setRemoteStream(remoteStream[0]);
      })
    })


    useEffect (() => {
      socket.on('user:joined',handleUserjoined)
      socket.on('incomming:call',handleIncommingCall)
      socket.on("call:accepted",handleCallAccepted)
      socket.on("peer:nego:needed", handleNegoNeedIncomming);
      socket.on("peer:nego:final", handleNegoNeedFinal);
      return () => {
      socket.off("user:joined",handleUserjoined)
      socket.off("incomming:call",handleIncommingCall)
      socket.off("call:accepted",handleCallAccepted)
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
         
      }
    },[handleUserjoined  , socket, handleIncommingCall ,handleNegoNeeded , handleNegoNeedFinal,handleCallAccepted])


  return (
    <>
    <div>Room</div>
    <h3>{remoteSocketId ? 'connected ':'no one is the room '}</h3>
    {myStream && <button onClick={sendStream}>Send Stream</button>}
    {remoteSocketId && <button onClick={handleCallUser}>Call</button> }
    {myStream &&
    <> 
    <h3>Mystream</h3>
     <ReactPlayer  
      playing muted 
      height="300px" 
      width="200px" 
      url={myStream}   
      />
    </>
    }
     {remoteStream &&
    <> 
    <h3>Remote stream</h3>
     <ReactPlayer  
      playing muted 
      height="300px" 
      width="200px" 
      url={remoteStream}   
      />
    </>
}
    </>
  )
}

export default Room