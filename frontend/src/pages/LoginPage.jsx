import React from 'react'
import MyForm from '../components/Form'
import '../styles/RegisterPage.css'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  return (
    <div className='register-page-container'>
      <div className='register-content'>
        <div className='logo-container'>
        </div>
        <MyForm route="/catalog/token/" method="login" />
        <p className='login-link'>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage