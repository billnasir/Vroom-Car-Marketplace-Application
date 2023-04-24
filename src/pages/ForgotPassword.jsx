 import { useState } from "react"
 import {Link} from 'react-router-dom'
 import {getAuth, sendPasswordResetEmail} from 'firebase/auth'
 import {toast} from 'react-toastify'
 import {BsArrowRight} from 'react-icons/bs';


function ForgotPassword() {
  //
  const [email , setEmail]= useState('')

  const onChange=(e )=> setEmail(e.target.value)
    
 
      
  const onSubmit= async(e) =>{
    e.preventDefault()
    try{
      const auth=getAuth()
      await sendPasswordResetEmail(auth, email);
      toast.success('Email was sent')
    }catch{
      toast.error('Email was sent')

    }
  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Your Password</p>
      </header>
       
       <main>
        <form onSubmit={onSubmit}>
          <input 
          type="email" 
          className="emailInput" 
          placeholder="Email"
          id='email'
          value={email}
          onChange={onChange}
           />
           
           <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button className="signInButton">
            <BsArrowRight fill='#ffffff' size={28}  />

            </button>
           </div>
         </form>
       </main>

    </div>
   )
}

export default ForgotPassword