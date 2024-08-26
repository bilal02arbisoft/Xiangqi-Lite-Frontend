import React from 'react';
import 'styles.css'; 
import SignUpPage from 'pages/SigninSignup/SignUpPage'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';



function App() {
  return (
      <BrowserRouter>
        <main>
          <Routes>
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
