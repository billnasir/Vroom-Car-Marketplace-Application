 import { useNavigate, useLocation  } from "react-router-dom"
 import {RiMenu3Line ,RiCloseLine} from 'react-icons/ri';
 import { getAuth } from "firebase/auth"
 import {AiFillCar} from 'react-icons/ai';
  import { useState } from "react";

  
function Navbar() {
   //This ensure that you can navigate to different pages
    const navigate=useNavigate();
    const auth= getAuth();
    const location= useLocation();
    const [toggleMenu, setToggleMenu]=useState(false)
    const user=auth.currentUser;

    const pathMatchRoute=(route)=>{
      if(route == location.pathname){
        return true;
      }
    }

    const onLogout=()=>{
      auth.signOut()
      navigate('/')
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
          <p  onClick={()=> navigate('/')}>Home</p>
          <p  onClick={()=> navigate('/offers')}>Explore</p>
          <p  onClick={() => navigate('/profile')}>Profile</p>
           
          
         </div>

         <div className="car__navbar-sign">
          {!user ?  <>
          <p onClick={() => navigate('/sign-in')}>Sign in</p>
          <button onClick={() => navigate('/sign-up')} type="button">Sign up</button>
           </>
           :<>
           <button onClick={onLogout} type="button">Logout</button>
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