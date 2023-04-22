import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
 import './App.css'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import Offers from './pages/Offers'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify';


function App() {

 
  return (
    
    <>
        <Navbar />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/offers" element={<Offers />} />
      <Route path='/profile' element={<PrivateRoute />}>
      <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
      
    <ToastContainer />
    </>
  )
}

export default App
