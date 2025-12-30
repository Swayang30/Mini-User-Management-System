import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify'
import { useAuth } from './context/useAuth'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const { user, logout } = useAuth()
  return (
    <div className="app">
      <nav className="nav">
        <div className="brand">MiniUMS</div>
        <div className="links">
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <Link to="/profile">Profile</Link>
              <button onClick={logout} className="btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to={user ? '/profile' : '/login'} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick pauseOnHover draggable theme="dark" />
    </div>
  )
}
