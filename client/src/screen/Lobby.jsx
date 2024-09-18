import React, { useState, useCallback, useEffect } from 'react'
import { useSocket } from '../context/SocketProvider'
import { useNavigate } from 'react-router-dom'

function Lobby() {
    const [roomId, setRoomId] = useState('')
    const [email, setEmail] = useState('')

    const socket = useSocket()
    const navigate = useNavigate()


    const handleSubmit = useCallback((e) => {
      e.preventDefault()
      socket.emit("room:join",{email, roomId})  // sending data to server
    }, [roomId, email , socket])

    const handleJoinRoom = useCallback((data) => {
      const {email , roomId} = data 
      navigate(`/roomId/${roomId}`)  //redirect to room id 
    },[navigate]) 

    useEffect(() => {
      socket.on("room:join",  handleJoinRoom)
      return () => {
         socket.off("room:join",handleJoinRoom)
      }
    },[socket])

  return (
    <div>
       <h3>Provide the following information to create a room or join a room</h3>
        <form onSubmit={handleSubmit}>
            <label htmlFor="roomId">Room ID</label>
            <input type="text" id="roomId"  value={roomId} onChange={(e) => setRoomId(e.target.value)} />
            <br />
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <br />
            <br />
            <button>submit</button>
            
        </form>
    </div>
  )
}

export default Lobby