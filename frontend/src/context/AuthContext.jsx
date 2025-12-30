import React, { useState, useEffect } from 'react'
import { AuthContext } from './context'
import api from '../services/api'
import { toast } from 'react-toastify'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const data = localStorage.getItem('auth')
      return data ? JSON.parse(data).user : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const d = localStorage.getItem('auth')
    if (d) {
      const { token } = JSON.parse(d)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [])

  const login = (token, user) => {
    localStorage.setItem('auth', JSON.stringify({ token, user }))
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('auth')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    toast.info('Logged out')
  }

  return <AuthContext.Provider value={{ user, login, logout, setUser }}>{children}</AuthContext.Provider>
}
