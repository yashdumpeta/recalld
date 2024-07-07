// src/App.js

import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage'
import ErrorPage from './pages/ErrorPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import Header from './components/Header';
import { AuthProvider } from './AuthContext';
import ManageCards from './pages/ManageCards';
import StudyPage from './pages/StudyPage';

function Logout() {
  localStorage.clear()
  return <Navigate to={"/login"} />
}

function RegisterLogout() {
  localStorage.clear()
  return <RegisterPage />
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<RegisterLogout />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-cards/:deckId"
              element={
                <ProtectedRoute>
                  <ManageCards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/study/:deckId"
              element={
                <ProtectedRoute>
                  <StudyPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;