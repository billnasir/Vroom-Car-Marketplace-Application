import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
 import './App.css'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import Offers from './pages/Offers'
import category from './pages/Category'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify';
import Category from './pages/Category';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing'
import Listing from './pages/Listing'
import Contact from './pages/Contact'

function App() {

 
  return (
    
    <>
        <Navbar />

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/category/:categoryName" element={<PrivateRoute />}>
      <Route path="/category/:categoryName" element={<Category />} />
      </Route>
      <Route path='/profile' element={<PrivateRoute />}>
      <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/create-listing" element={<CreateListing />} />
      <Route path="/edit-listing/:listingId" element={<EditListing />} />
      <Route path='/category/:categoryName/:listingId' element={<PrivateRoute />}>
      <Route path='/category/:categoryName/:listingId' element={<Listing />}    />
       </Route>
       <Route path='/contact/:sellerId' element={<Contact />} />
     </Routes>
      
    <ToastContainer />
    </>
  )
}

export default App
