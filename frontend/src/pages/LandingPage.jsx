import React from 'react'
import '../styles/LandingPage.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext';

const LandingPage = () => {

  const navigate = useNavigate();
  const { user, checkAuthStatus } = useAuth();

  const handleStartRecalling = async () => {
    await checkAuthStatus();
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className='page-container'>
      <div className='content-wrapper'>
        <h1 id='slogan'>Master your memory.</h1>
        <h2 id='slogan-description'>A flashcard app empowering you with the tools to retain your information.</h2>
        <div className='cta-container'>
          <button id='register-button' onClick={handleStartRecalling}>Start Recalling</button>
        </div>
      </div>
    </div>
  )
}

export default LandingPage