 import { useState } from "react"
 import {Link} from 'react-router-dom'
 import {getAuth, sendPasswordResetEmail} from 'firebase/auth'
 import {toast} from 'react-toastify'
 import {BsArrowRight} from 'react-icons/bs';


function ForgotPassword() {
  //
  const [email , setEmail]= useState('')

  const onChange=e =>{
     
  }

  const onSubmit= e =>{
    e.preventDefault()
  }

  return (
    <div>ForgotPassword</div>
  )
}

export default ForgotPassword