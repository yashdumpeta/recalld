import React from 'react'
import MyForm from '../components/Form'
import '../styles/RegisterPage.css'
import { Link } from 'react-router-dom'

const RegisterPage = () => {
  return (
    <div className='register-page-container'>
      <div className='register-content'>
        <div className='logo-container'>
        </div>
        <MyForm route="/catalog/user/register/" method="register" />
        <p className='login-link'>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage