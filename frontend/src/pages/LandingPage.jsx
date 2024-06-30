import React from 'react'
import '../styles/LandingPage.css'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className='page-container'>
      <div className='content-wrapper'>
        <h1 id='slogan'>Master your memory.</h1>
        <h2 id='slogan-description'>A flashcard app empowering you with the tools to retain your information.</h2>
        <div className='cta-container'>
          <Link id='register-button' to='/register' className="register-button">Get recalld for free</Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage