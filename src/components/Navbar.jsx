 import { useNavigate, useLocation  } from "react-router-dom"
 import {RiMenu3Line ,RiCloseLine} from 'react-icons/ri';
 import { getAuth, onAuthStateChanged } from "firebase/auth"
 import {AiFillCar} from 'react-icons/ai';
  import { useState, useEffect } from "react";

  
function Navbar() {
   //This ensure that you can navigate to different pages
    const navigate=useNavigate();
    const auth= getAuth();
    const location= useLocation();
    const [toggleMenu, setToggleMenu]=useState(false)
    const user=auth.currentUser;
    const [currentUser, setCurrentUser]=useState({})
     
     useEffect(()=>{
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User present
          setCurrentUser(user)
          // redirect to home if user is on /login page 
        } else {
          
          // User not logged in
           // redirect to login if on a protected page 
        }
      })
       
    },[user])
    
    const pathMatchRoute=(route)=>{
      if(route == location.pathname){
        return true;
      }
    }

    const onLogout=()=>{
      auth.signOut()
      navigate('/sign-up')
      window.location.reload(false);

    }

  return (
      <div className="car__navbar">
        <div className="car__navbar-links">
          <div onClick={()=> navigate('/')} className="car__navbar-links_logo">
         
        <AiFillCar   size={50} /><h1 className="logo_text">Vroom</h1>
          </div>
        
        
        </div>
        <div className="car__navbar-links_container">
          <p className={pathMatchRoute('/') ?'navbarListItemNameActive' : 'navbarListItemName'} onClick={()=> navigate('/')}>Home</p>
          <p className={pathMatchRoute('/offers') ?'navbarListItemNameActive' : 'navbarListItemName'} onClick={()=> navigate('/offers')}>Explore</p>
          <p className={pathMatchRoute('/profile') ?'navbarListItemNameActive' : 'navbarListItemName'}  onClick={() => navigate('/profile')}>Profile</p>
           
          
         </div>

         <div className="car__navbar-sign">
          {user &&  <>
            <button onClick={onLogout} type="button">Logout</button>
           </>
          }
           {!user && <>
           <p onClick={() => navigate('/sign-in')}>Sign in</p>
          <button onClick={() => navigate('/sign-up')} type="button">Sign up</button>
            </>
           }
           
         </div>
    
         <div className="car__navbar-menu">
          {toggleMenu 
           ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
           : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />
             }
             {toggleMenu && (
              <div className="car__navbar-menu_container">
               <div className="car__navbar-menu_container-links">
               <p  onClick={()=> navigate('/')}>Home</p>
          <p  onClick={()=> navigate('/offers')}>Explore</p>
          <p  onClick={() => navigate('/profile')}>Profile</p>
           
                <div className="car__navbar-menu_container-links-sign">
                {!user ?  <>
          <p onClick={() => navigate('/sign-in')}>Sign in</p>
          <button onClick={() => navigate('/sign-up')} type="button">Sign up</button>
           </>
           :<>
           <button onClick={onLogout} type="button">Logout</button>
            </>
          }
         </div>
               </div>
              </div>
             )}
         </div>

      </div>
     
  )
}

export default Navbar