import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider'

function Room() {
    const socket  = useSocket()
    const [remoteSocketId , setRemoteSocketId] = useState(null)

    const handleUserjoined = useCallback((email , id) => setRemoteSocketId(id) ,[])

    useEffect (() => {
      socket.on('user:joined',handleUserjoined)
      return () => {
         socket.off("user:joined",handleUserjoined)
      }
    },[handleUserjoined  , socket])

  return (
    <>
    <div>Room</div>
    <h3>{remoteSocketId ? 'connected ':'no one is the room '}</h3>
    <h3>{remoteSocketId}</h3>
    </>
  )
}

export default Room