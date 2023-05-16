 import {useState, useEffect} from 'react'
 import {Link, useNavigate, useParams} from 'react-router-dom'
 import { MapContainer,Marker, Popup,TileLayer } from 'react-leaflet'
 import {getDoc, doc} from 'firebase/firestore'
 import  {Navigation, Pagination, Scrollbar, A11y} from 'swiper'
 import { Swiper, SwiperSlide } from 'swiper/react';
  // Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

 import { getAuth } from 'firebase/auth'
 import {db} from '../firebase.config'
 import Spinner from '../components/Spinner'
 import {BsFillShareFill} from "react-icons/bs"

function Listing() {
  const [listing, setListing]= useState()
  const  [loading, setLoading]=useState(true);
   
  const navigate= useNavigate()
  const params= useParams()
  const auth= getAuth()
  
  useEffect(()=>{
    //Asynchronous fetchListing
    const fetchListing= async()=>{
      //Get reference
      const docRef=doc(db, 'listings', params.listingId);
      const docSnap=await getDoc(docRef)
       
      //If docSnap exists
      if(docSnap.exists()){
        
         //Store data in setListing
        setListing(docSnap.data())
        //set Loading to false
        setLoading(false)
      }
    }
    fetchListing()
  },[navigate, params.listingId])

  if(loading){
    return <Spinner />
  }

   
  return (
    <div>
    <Swiper 
    modules={[Navigation, Pagination, Scrollbar, A11y]}
    slidesPerView={1} 
    pagination={{clickable:true}}
    
    >
      {listing?.imgUrls.map((url,index)=>(
         <SwiperSlide key={index}>
         <div style={{
          background:`url(${listing.imgUrls[index]}) center no-repeat`,
          backgroundSize:'cover',
          minHeight:'35rem',
          objectFit: 'cover'
         }} className='swiperSlideDiv'></div>
         </SwiperSlide>
      ))}
    </Swiper>
     
   
       <div className="listingDetails">
        <p className="listingName-big">{listing?.name} - ${listing?.offer ? listing?.discountedPrice : listing?.regularPrice}</p>
        <p className="listingLocation">{listing?.location}</p>
         <p className="listingType">
          For {listing?.type === 'rent' ?  'Rent' : 'For Sale'}
         </p>
         {listing?.offer && (
          <p className="discountPrice">
            ${listing?.regularPrice - listing?.discountedPrice} discount
          </p>
         )}
         <p className="listingTypeRent">
           {listing?.condition}
           </p>

         <ul className="listingDetailsList">
          <li>
           Company:  {listing?.company}
          </li>
          <li>
           Car Type:  {listing?.carType}
          </li>
          <li>
          Number of Seats:  {listing?.seats}
          </li>
          <li>
          Model Type:  {listing?.model}
          </li>
          <li>
          Fuel Type:  {listing?.fuelType}
          </li>
          <li>
          Colour:  {listing?.colour}
          </li>
         </ul>
         
         <p className="listingLocationTitle">Location</p>
         <div className="leafletContainer">
         <MapContainer style={{height: '100%' , width: '100%'}} center={ [listing?.geolocation?.lat, listing?.geolocation?.lng]} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={ [listing?.geolocation?.lat, listing?.geolocation?.lng]}>
      <Popup>
      {listing?.address}
       </Popup>
    </Marker>
  </MapContainer>
          </div>
         
         {auth.currentUser?.uid !== listing?.userRef && (
          <Link
           to={`/contact/${listing?.userRef}?listingName=${listing?.name}&listingLocation=${listing?.location}`}
           className='primaryButton'
          >
           Contact Seller
          </Link>
         )}

        </div>

       

    </div>

  )
}

export default Listing