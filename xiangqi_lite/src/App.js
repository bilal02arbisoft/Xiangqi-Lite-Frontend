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

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
             <Route path="/auth" element={<SignUpPage />}>
              <Route path="login" element={<SignUpPage />} />
              <Route path="signup" element={<SignUpPage />} />
              </Route>
         
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path="globalchat" element={<ProtectedRoute><GlobalChat/></ProtectedRoute>} />
          <Route path="/friend" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
          <Route path="/verify-otp" element={<ProtectedRoute><VerifyOtpPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
          <Route path="/game/:game_id?" element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
