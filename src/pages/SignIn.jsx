 import { useState } from "react"
 import {Link, useNavigate} from 'react-router-dom'
 import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
 import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
 import OAuth from "../components/OAuth";
 import {BsArrowRight} from 'react-icons/bs';
 import visibilityIcon from '../assets/svg/visibilityIcon.svg'


function SignIn() {
 const [showPassword, setShowPassword]=useState(false)
 const [formData, setFormData]=useState({
   email:'',
   password:''
 })

 const {email, password}= formData
 const navigate= useNavigate()

 const onChange= (e) =>{
   setFormData((prevState) =>({
    ...prevState,
    [e.target.id]:e.target.value,
   }))
 }

  const onSubmit= async(e) =>{
    e.preventDefault()

    //Created a try and catch
    try{
      //Firebase auth object
      const auth=getAuth()

      const userCredential= await signInWithEmailAndPassword(auth, email, password)
  
      if(userCredential.user){
        toast.success("User Authenticated", {
          position: toast.POSITION.BOTTOM_RIGHT
        });
        navigate('/')
      }
    }catch(error){
     
     toast.error("Incorrect Registration!", {
      position: toast.POSITION.BOTTOM_RIGHT
    });
    }
    
   
  }

  return (
    <div className="pageContainer">
     <header>
      <div className="pageHeader">Welcome Back !</div>
     </header>

     <form onSubmit={onSubmit}>
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
        
        <div className="signInBar">
          <p className="signInText">
            Sign In
          </p>
          <button className="signInButton">
          <BsArrowRight fill='#ffffff' size={28}  />
           </button>
        </div>

     </form>
      
      <OAuth />
      
    </div>
  )
}

export default SignIn