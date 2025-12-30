import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { toast } from 'react-toastify'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../context/useAuth'

export default function AdminDashboard() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [confirm, setConfirm] = useState(null) // { id, action, message }

  const loadUsers = async (p = 1) => {
    setLoading(true)
    try {
      const res = await api.get(`/users?page=${p}`)
      setUsers(res.data.users)
      setPage(res.data.page)
      setPages(res.data.pages)
    } catch (err) { toast.error(err.message) } finally { setLoading(false) }
  }

  useEffect(()=>{ loadUsers(1) }, [])

  // show confirm modal instead of window.confirm
  const requestStatusChange = (u, action) => {
    if (!currentUser) return toast.error('Not authenticated')
    if (u._id === currentUser._id) return toast.error("You can't change your own status")
    const message = action === 'deactivate' ? 'Are you sure you want to deactivate this user?' : 'Activate this user?'
    setConfirm({ id: u._id, action, message, user: u })
  }

  const doStatusChange = async () => {
    if (!confirm) return
    const { id, action } = confirm
    setActionLoading(id)
    setConfirm(null)
    try {
      await api.patch(`/users/${id}/${action}`)
      toast.success('Updated')
      await loadUsers(page)
    } catch (err) { toast.error(err.message) } finally { setActionLoading(null) }
  }

  return (
    <div className="card">
      <h2>Admin Dashboard</h2>
      {loading ? <p>Loading...</p> : (
        <>
          {users.length === 0 ? (
            <p>No users yet. Invite users or sign up to populate the list.</p>
          ) : (
            <div className="table-wrap">
              <table className="user-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u=> (
                    <tr key={u._id} className={u.status === 'inactive' ? 'muted' : ''}>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.status}</td>
                      <td>
                        {u.status === 'active' ? (
                          <button className="btn btn-ghost" onClick={()=>requestStatusChange(u,'deactivate')} disabled={actionLoading===u._id || u._id === currentUser?._id}>{actionLoading===u._id ? 'Updating...' : 'Deactivate'}</button>
                        ) : (
                          <button className="btn" onClick={()=>requestStatusChange(u,'activate')} disabled={actionLoading===u._id || u._id === currentUser?._id}>{actionLoading===u._id ? 'Updating...' : 'Activate'}</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pagination">
            <button className="btn" onClick={()=>loadUsers(page-1)} disabled={page<=1}>Prev</button>
            <span>Page {page} of {pages}</span>
            <button className="btn" onClick={()=>loadUsers(page+1)} disabled={page>=pages}>Next</button>
          </div>
        </>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Confirm action"
        message={confirm?.message}
        targetUser={confirm?.user}
        onCancel={()=>setConfirm(null)}
        onConfirm={doStatusChange}
        confirmLabel={confirm?.action === 'activate' ? 'Activate user' : 'Deactivate user'}
      />
    </div>
  )
}
