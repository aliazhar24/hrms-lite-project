import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import Employees from "./pages/Employees"
import Attendance from "./pages/Attendance"

function App() {

  return (
    <>

      <BrowserRouter>

        <Navbar />

        <div className="p-8 max-w-6xl mx-auto">

          <Routes>

            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />

          </Routes>

        </div>

      </BrowserRouter>
    </>

  )
}


export default App