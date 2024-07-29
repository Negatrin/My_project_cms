import React, { useRef, useState, useEffect } from 'react';
import { ResetPassword } from '../api/AuthService';
import './ResetPasswordModal.css'; // Import the CSS file for styling

const ResetPasswordModal = ({ showModal, toggleModal }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const modalRef = useRef();

  useEffect(() => {
    if (showModal) {
      modalRef.current.showModal();
    } else {
      modalRef.current.close();
    }
  }, [showModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('auth-token');
      await ResetPassword(userId, password, token);
      toggleModal(false);
      alert('Password successfully changed'); // Close the modal
    } else {
      alert('Passwords do not match');
    }
  };

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal__header">
        <h3>Reset Password</h3>
        <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
      </div>
      <div className="divider"></div>
      <div className="modal__body">
        <form onSubmit={handleSubmit}>
          <div className="user-details">
            <div className="input-box">
              <span className="details">New Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                required
              />
            </div>
            <div className="input-box">
              <span className="details">Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                name="confirmPassword"
                required
              />
            </div>
          </div>
          <div className="form_footer">
            <button onClick={() => toggleModal(false)} type="button" className="btn btn-danger">
              Cancel
            </button>
            <button type="submit" className="btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ResetPasswordModal;
