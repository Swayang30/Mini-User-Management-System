import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function ConfirmModal({ open, title, message, targetUser, onConfirm, onCancel, confirmLabel = 'Confirm', cancelLabel = 'Cancel' }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel && onCancel()
    }

    // add keyboard handling + lock scroll / add page blur while modal open
    if (open) {
      window.addEventListener('keydown', onKey)
      document.body.classList.add('modal-open')
    }

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('modal-open')
    }
  }, [open, onCancel])

  if (!open) return null

  const modal = (
    <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-icon">⚠️</div>
          <h3>{title}</h3>
        </div>
        <p className="muted">{message}</p>

        {targetUser && (
          <div className="confirm-user">
            <div className="user-line"><strong>Name:</strong> {targetUser.fullName}</div>
            <div className="user-line"><strong>Email:</strong> {targetUser.email}</div>
            <div className="user-line"><strong>Role:</strong> {targetUser.role} <span style={{marginLeft:12}}><strong>Status:</strong> {targetUser.status}</span></div>
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>{cancelLabel}</button>
          <button className="btn" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )

  // render modal in document.body so it doesn't get blurred by .app filter
  return createPortal(modal, document.body)
}
