import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { toast } from 'react-toastify'

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await api.post('/auth/signup', { fullName, email, password })
      login(res.data.token, res.data.user)
      toast.success('Welcome!')
      navigate('/profile')
    } catch (err) {
      toast.error(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="card">
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <label>Full Name<input value={fullName} onChange={e=>setFullName(e.target.value)} required /></label>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} required type="email" /></label>
        <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} required type="password" /></label>
        <button className="btn" disabled={loading}>{loading ? 'Signing up...' : 'Signup'}</button>
      </form>
    </div>
  )
}
