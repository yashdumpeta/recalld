import React, { useState } from 'react'
import '../styles/Header.css'
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const back_home = (event) => {
    if (location.pathname === '/') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
            <Link to='/Dashboard'>Dashboard</Link>
            <Link to='/login'>Login</Link>
            <Link id='free-signup' to='/register' className="register-button">Free signup</Link>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default Header