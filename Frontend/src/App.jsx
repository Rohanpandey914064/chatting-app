import React from "react"
import { Route, Routes } from "react-router-dom"
import LobbySection from "./Screens/LobbySection"
import Room from "./Screens/Room"

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<LobbySection/>}/>
        <Route path="/room/:roomId" element={<Room/>}/>
      </Routes>
    </div>
  )
}

export default App
