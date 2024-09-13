import './App.css'
import { Routes, Route } from 'react-router-dom'
import Lobby from './screen/Lobby'
import Room from './screen/Room'


function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/roomId/:roomId" element={<Room/>} />
    </Routes>
    </>
  )
}

export default App
