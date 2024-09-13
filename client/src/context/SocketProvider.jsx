import {createContext,useContext, useMemo} from 'react'
import {io} from 'socket.io-client'

//create context
const SocketContext = createContext(null)

//custom hook to use socket
export const useSocket = () => {
  const socket = useContext(SocketContext)

  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return socket
}

//provider to wrap the app
export const SocketProvider = (props) => {
     const socket = useMemo(() => io("localhost:5000"), [])
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}