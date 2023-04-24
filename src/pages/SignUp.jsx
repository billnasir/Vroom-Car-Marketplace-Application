import { useState } from "react"
import {Link, useNavigate} from 'react-router-dom'
import {getAuth, createUserWithEmailAndPassword, updateProfile}
from 'firebase/auth'
import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
 import OAuth from "../components/OAuth";
import {setDoc, doc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {BsArrowRight} from 'react-icons/bs';
import visibilityIcon from '../assets/svg/visibilityIcon.svg'


function SignUp() {
const [showPassword, setShowPassword]=useState(false)
const [formData, setFormData]=useState({
  name:'',
  email:'',
  password:'',
})

const {name,email, password}= formData

const navigate= useNavigate()

const onChange= (e) =>{
  setFormData((prevState) =>({
   ...prevState,
   [e.target.id]:e.target.value,
  }))
}

 const onSubmit= async (e) =>{
  e.preventDefault()
  
  //User Authentication
  try{
    const auth= getAuth()
     
    //Creates a new account
    const userCredential= await createUserWithEmailAndPassword(
      auth,
      email,
      password
      );
    
    const user=userCredential.user

     updateProfile(auth.currentUser, {
     displayName:name,
 
    })
    //Create formData copy and spread it
    const formDataCopy={...formData}
    
    //Delete the password from the form
    delete formDataCopy.password
    
    //
    formDataCopy.timestamp = serverTimestamp()

    await setDoc(doc(db, 'users', user.uid), formDataCopy);
    toast.success("User Authenticated", {
      position: toast.POSITION.BOTTOM_RIGHT
    });
    navigate('/')
  }catch(error){
    toast.error("Incorrect Registration!", {
      position: toast.POSITION.BOTTOM_RIGHT
    });  }
 }

 return (
   <div className="pageContainer">
    <header>
     <div className="pageHeader">Welcome Back !</div>
    </header>

    <form onSubmit={onSubmit}>
    <input 
     type='text' 
     className='nameInput'
     placeholder='Name'
     id='name'
     value={name}
     onChange={onChange}
     />

     <input 
     type='email' 
     className='emailInput'
     placeholder='Enter your email'
     id='email'
     value={email}
     onChange={onChange}
     />
     <div className="passwordInputDiv">
     <input 
     type={showPassword ? 'text' : 'password'} 
     className='passwordInput'
     placeholder='Password'
     id='password'
     value={password}
     onChange={onChange}
     />

     <img src={visibilityIcon} 
     alt="show password"
     className="showPassword"
     onClick={() => setShowPassword((prevState) => !prevState)}
      />
     </div>

      <Link to='/forgot-password'
       className='forgotPasswordLink'>
         Forgot Password
       </Link>
       
       <div className="signUpBar">
         <p className="signUpText">
           Sign Up
         </p>
         <button className="signUpButton">
         <BsArrowRight fill='#ffffff' size={28}  />
          </button>
       </div>

    </form>
   
    <OAuth />

      
   </div>
 )
}

export default SignUp