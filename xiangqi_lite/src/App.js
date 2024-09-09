import React from "react";
import "styles.css";
import SignUpPage from "pages/SigninSignup/SignUpPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfileEditPage from "pages/Profile/Profile";
import VerifyOtpPage from "pages/Profile/VerifyOtp";
import FriendsPage from "pages/Friend/Friend";
import BoardPage from "pages/Game/BoardPage";
import { AuthProvider } from "auth/AuthProvider";
import ProtectedRoute from "components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<SignUpPage />}>
            <Route path="login" element={<SignUpPage />} />
            <Route path="signup" element={<SignUpPage />} />
          </Route>

          <Route path="/" element={<SignUpPage />}></Route>
          <Route
            path="/friend"
            element={
              <ProtectedRoute>
                <FriendsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <ProtectedRoute>
                <VerifyOtpPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/:game_id?"
            element={
              <ProtectedRoute>
                <BoardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
