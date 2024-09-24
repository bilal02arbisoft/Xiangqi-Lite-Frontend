// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'styles.css';

import { AuthProvider } from 'auth/AuthProvider';
import ProtectedRoute from 'components/ProtectedRoute';

import SignUpPage from 'pages/SigninSignup';
import ProfileEditPage from 'pages/Profile';
import VerifyOtpPage from 'pages/VerifOtp';
import FriendsPage from 'pages/Friend';
import BoardPage from 'pages/Game';
import Home from 'pages/Home';
import GlobalChat from 'pages/GlobalChat';
import Layout from 'components/Layout'; 

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
       
          <Route path="/auth" element={<SignUpPage />}>
            <Route path="login" element={<SignUpPage />} />
            <Route path="signup" element={<SignUpPage />} />
          </Route>

        
        
            <Route path="/" element={<Home />} />
            <Route path="globalchat" element={<GlobalChat />} />
            <Route path="/friend" element={<FriendsPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/profile" element={<ProfileEditPage />} />
            <Route path="/game/:game_id?" element={<BoardPage />} />
       
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
