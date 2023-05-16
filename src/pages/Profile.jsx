 import {useState,useEffect} from 'react'
 import {Link } from 'react-router-dom'
 import { Navigate } from "react-router-dom";

 import { getAuth, updateProfile } from 'firebase/auth'
 import{
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  deleteDoc,
 }from 'firebase/firestore'
 import {useNavigate} from 'react-router-dom'
 import {db} from '../firebase.config'
 import {toast} from 'react-toastify'
 import ListingItem from '../components/ListingItem'
 import {BsArrowRight} from 'react-icons/bs';
 import {AiFillCar} from 'react-icons/ai';

function Profile() {
   const auth=getAuth()
   const[loading, setLoading]=useState(true)
   const[listings, setListings]=useState(null)
   const [changeDetails, setChangeDetails]=useState(false)
   const [formData, setFormData]=useState({
    name:auth.currentUser?.displayName,
    email:auth.currentUser?.email
   })
   
   //Destructuring name and email from formData
   const {name, email}=formData
   const navigate=useNavigate()

   useEffect(()=>{
    const fetchUserListings= async()=>{
     const listingsRef=collection(db,'listings')

     const q=query(
      listingsRef,
      where('userRef', '==', auth.currentUser.uid),
      orderBy('timestamp', 'desc')
     )
     const querySnap= await getDocs(q)
     
     //store listings in an array
     let listings=[]

     querySnap.forEach((doc) =>{
       return listings.push({
        id:doc.id,
        data:doc.data()
       })
     })
      
        setListings(listings)
        setLoading(false)
    }
    fetchUserListings()
   },[auth.currentUser.uid])

   const onSubmit= async()=>{
    //Try and cath
     try{
      //If display name is not equal to name
      if(auth.currentUser.displayName !==name){
        //Update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName:name
        })

        //Update  firestore
         const userRef=doc(db, 'users', auth.currentUser.uid);
         await updateDoc(userRef, {
          name
         })
      }
     }catch(error){
      toast.error('Could not access profile information!')
     }
   }

   const onChange=(e)=>{
    setFormData((prevState)=> ({
      ...prevState,
      [e.target.id]:e.target.value,
    }))
   }
   
   const onDelete= async(listingId)=>{
    if(window.confirm('Do you want to  delete this listing?')){
       await deleteDoc(doc(db, 'listings', listingId))
       const updatedListings= listings.filter((listing)=>{
        return listing.id !== listingId
       })
       setListings(updatedListings)
       toast.success("Your listing has been successfully deleted!")
    }
   }
    
      const onEdit= (listingId)=>{
        console.log(listingId)
        navigate(`/edit-listing/${listingId}`)
      }

  return (  <div className='profile'>
    <header className='profileHeader'>
     <p className="profileHeader">My Profile</p> 
    </header>

    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">Personal Details</p>
        <p className="changePersonalDetails"
         onClick={()=>{
          changeDetails && onSubmit()
          setChangeDetails((prevState) => !prevState)
         }}
        >
        {changeDetails ? 'done' : 'change'}
        </p>
      </div>

       <div className="profileCard">
        <form>
          <input 
           type="text" 
           id="name"
           className={!changeDetails ? 'profileName' : 'profileNameActive'}
           disabled={!changeDetails}
           value={name}
           onChange={onChange}

            />
             <input 
           type="text" 
           id="email"
           className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
           disabled={!changeDetails}
           value={email}
           onChange={onChange}
            />
        </form>
       </div>
      <Link to='/create-listing' className='createListing'>
       <AiFillCar size={28} />
       <p>Sell or rent a car!</p>
       <BsArrowRight />
      </Link>
      
       {!loading && listings?.length > 0 && (
        <>
          <p className="listingText">Your Listings</p>
          <ul className="listingsList">
            {listings.map((listing)=>(
              <ListingItem 
                key={listing.id}
                listing={listing.data}
                id={listing.id}
                onDelete={()=> onDelete(listing.id)}
                onEdit={()=> onEdit(listing.id)}
              />
            ))}
          </ul>
        </>
       )}
    </main>
  </div>
  )
}

export default Profile