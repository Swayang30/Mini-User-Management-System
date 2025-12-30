import React, { useState, useEffect, useMemo } from 'react'
import api from '../services/api'
import { useAuth } from '../context/useAuth'
import { toast } from 'react-toastify'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    setFullName(user?.fullName || '')
    setEmail(user?.email || '')
  }, [user])

  const hasChanged = useMemo(() => {
    return (fullName !== (user?.fullName || '')) || (email !== (user?.email || ''))
  }, [fullName, email, user])

  const save = async (e) => {
    e.preventDefault()
    if (!hasChanged) return
    setLoading(true)
    try {
      const res = await api.patch('/users/me', { fullName, email })
      setUser(res.data.user)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.message)
    } finally { setLoading(false) }
  }

  const validateNewPassword = (p) => {
    // match backend policy: min 8, upper, lower, number, symbol
    const ok = /(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(p)
    return ok
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (!oldPassword || !newPassword) return toast.error('Please provide both passwords')
    if (!validateNewPassword(newPassword)) return toast.error('Password must be 8+ chars, include upper/lower/number/symbol')
    setPassLoading(true)
    try {
      await api.patch('/users/me/password', { oldPassword, newPassword })
      toast.success('Password updated')
      setOldPassword('')
      setNewPassword('')
    } catch (err) {
      toast.error(err.message)
    } finally { setPassLoading(false) }
  }

  return (
    <div className="card profile-card">
      <h2>Profile</h2>
      <form onSubmit={save} className="profile-form">
        <label>Full Name
          <input value={fullName} onChange={e=>setFullName(e.target.value)} required />
        </label>
        <label>Email
          <input value={email} onChange={e=>setEmail(e.target.value)} required type="email" />
        </label>
        <button className="btn" disabled={!hasChanged || loading}>{loading ? 'Saving...' : 'Save'}</button>
      </form>

      <hr />

      <h3>Change Password</h3>
      <form onSubmit={changePassword} className="profile-form">
        <label>Old Password
          <div className="password-row">
            <input value={oldPassword} onChange={e=>setOldPassword(e.target.value)} required type={showOld ? 'text' : 'password'} />
            <button type="button" className="btn btn-ghost small" onClick={()=>setShowOld(s=>!s)}>{showOld ? 'Hide' : 'Show'}</button>
          </div>
        </label>
        <label>New Password
          <div className="password-row">
            <input value={newPassword} onChange={e=>setNewPassword(e.target.value)} required type={showNew ? 'text' : 'password'} />
            <button type="button" className="btn btn-ghost small" onClick={()=>setShowNew(s=>!s)}>{showNew ? 'Hide' : 'Show'}</button>
          </div>
        </label>
        <button className="btn" disabled={passLoading}>{passLoading ? 'Saving...' : 'Change Password'}</button>
      </form>
    </div>
  )
}
