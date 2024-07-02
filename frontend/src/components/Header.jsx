// src/components/Header.jsx

import React, { useState } from 'react'
import '../styles/Header.css'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const back_home = (event) => {
    if (location.pathname === '/') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div id='header-container'>
      <header>
        <div className="header-content">
          <Link id="logo" to="/" onClick={back_home}>
            recalld
          </Link>
          <button className="menu-toggle" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
          <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
            <Link to='/'>Home</Link>
            <Link to='/dashboard'>Dashboard</Link>
            {user ? (
              <>
                <span id='username'>{user.username}</span>
                <button className='account-button' onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to='/login'>Login</Link>
                <Link id='free-signup' to='/register' className="account-button">Sign up</Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </div>
  )
}

export default Header