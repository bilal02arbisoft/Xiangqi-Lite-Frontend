import React from 'react';
import './styles.css';
import Home from './pages/Home/Home'
import SignUpPage from './pages/SigninSignup/SignUpPage';
import {BrowserRouter,Routes, Route, Link } from 'react-router-dom'
import SignInForm from './pages/SigninSignup/Components/SigninForm';
import SignUpForm from './pages/SigninSignup/Components/SignupForm';
import ProfileEditPage from './pages/Profile';


function App() {
  return (
    <BrowserRouter>
    <main>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/profile' element={<ProfileEditPage/>}/>
        
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

