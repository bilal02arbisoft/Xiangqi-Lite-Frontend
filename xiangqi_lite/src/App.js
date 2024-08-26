import React from 'react';
import 'styles.css';
import SignUpPage from 'pages/SigninSignup/SignUpPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProfileEditPage from "pages/Profile/Profile";
import VerifyOtpPage from 'pages/Profile/VerifyOtp';
import FriendsPage from 'pages/Friend/Friend'
import BoardPage from 'pages/Game/BoardPage';


function App() {
  return (
      <BrowserRouter>
        <main>
          <Routes>
          <Route path='/friend' element ={<FriendsPage/>} />
            <Route path="/verify-otp" element= {<VerifyOtpPage />} />
            <Route path='/profile' element={<ProfileEditPage />} />
            <Route path="/game/:game_id?" element={<BoardPage />} />
            <Route path="/auth" element={<SignUpPage />}>
              <Route path="login" element={<SignUpPage />} />
              <Route path="signup" element={<SignUpPage />} />
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
  );
}

export default App;
