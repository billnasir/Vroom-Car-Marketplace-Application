 import { useEffect, useState, useRef } from "react"
 import {getAuth, onAuthStateChanged} from 'firebase/auth'

 //The intended purpose of this hook is to determine whether the user is authenticated
export const useAuthStatus = () => {
  //Logged In State and checkingStatus
  const [loggedIn, setLoggedIn]=useState(false)
  const [checkingStatus, setCheckingStatus]=useState(true)
  const isMounted=useRef(true);
  
  useEffect(()=>{
   if(isMounted){
    const auth= getAuth()

    //Auth state listener
    onAuthStateChanged(auth, (user)=>{
      //If user exists, setLoggedIN changes to true
      if(user){
        setLoggedIn(true)
      }
      //set status to false
      setCheckingStatus(false)
    })
   }
   return ()=>{
    isMounted.current=false;
   }
  
  }, [isMounted])

 return {loggedIn, checkingStatus}
}

 