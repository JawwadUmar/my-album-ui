import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Gallery from './pages/Gallery'

function App() {

  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={isAuthenticated ? <Gallery /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App


