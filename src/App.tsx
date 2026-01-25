import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Gallery from './pages/Gallery'
import Toast from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'

function App() {



  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Gallery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App


