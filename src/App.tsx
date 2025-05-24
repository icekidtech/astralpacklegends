"use client"

import { Routes, Route } from "react-router-dom"
import { motion } from "framer-motion"
import Home from "./pages/Home"
import Mint from "./pages/Mint"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cosmic-dark via-cosmic-medium to-cosmic-light">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mint" element={<Mint />} />
        </Routes>
      </motion.div>
    </div>
  )
}

export default App
