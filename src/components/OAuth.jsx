 import {useLocation, useNavigate} from 'react-router-dom'
 import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
 import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore'
 import {db} from '../firebase.config'
 import {toast} from 'react-toastify'
 import {FcGoogle} from 'react-icons/fc';

 

const OAuth = () => {
  const navigate=useNavigate()
  const location=useLocation()

  const onGoogleClick=async()=>{
    try{
     const auth=getAuth();
     const provider=new GoogleAuthProvider()
     const result= await signInWithPopup(auth, provider)
     const user= result.user
     
     //Lookup the user 
     const docRef= doc(db, 'users', user.uid)
     const docSnap=await getDoc(docRef)
      
     //If user doesn't exist in docSnap create a user
     if(!docSnap.exists()){
      //Create new user
       await setDoc(doc(db, 'users', user.uid),{
        name:user.displayName,
        email:user.email,
        timestamp:serverTimestamp()
       })
     }
     navigate('/')
    }catch(error){
      toast.error('Could not access account')
    }
  }

  return (
    <div className="socialLogin">
      <button onClick={onGoogleClick} className="socialIconDiv">
        <FcGoogle size={27} />
       <span id='socialIconText'>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with Google</span> 
      </button>
    </div>
  )
}

export default OAuth