import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import ResetPasswordModal from './ResetPasswordModal';

const Header = ({ toggleModal, nbOfContacts }) => {
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('auth-token')
    navigate('/login');
  };

  const handleResetPassword = () => {
    setShowResetPasswordModal(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/contacts">Contact Manager</Link>
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>
        ☰
      </div>
      <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
        <ul className="nav-links">
          <li className="nav-item">
            <span onClick={() => toggleModal(true)}>Add Contact</span>
          </li>
          <li className="nav-item">
            <span>Total Contacts: {nbOfContacts}</span>
          </li>
          <li className="nav-item dropdown">
            <span className="dropdown-toggle">Account</span>
            <ul className="dropdown-menu">
              <li onClick={handleResetPassword}>Reset Password</li>
              <li onClick={handleSignOut}>Sign Out</li>
            </ul>
          </li>
        </ul>
      </nav>
      <ResetPasswordModal
        showModal={showResetPasswordModal}
        toggleModal={setShowResetPasswordModal}
      />
    </header>
  );
};

export default Header;