import  {useState, useEffect} from 'react'
import { useNavigate } from 'react-router'
import { collection,getDocs,query, orderBy, limit } from 'firebase/firestore'
import {db} from '../firebase.config'
import  {Navigation, Pagination, Scrollbar, A11y,Autoplay} from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react';
 // Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Spinner from './Spinner'

function Slider() {
  //Set loading to true
  const[loading, setLoading]=useState(true)
  const[listings, setListings]=useState(null)

  const navigate=useNavigate()

 

  useEffect(()=>{
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false)
    }

    fetchListings()
  }, [])
  if(loading){
    return <Spinner />
  }

  return (
    listings && (
      <>
        <p className="exploreCategoryHeading">Car Listings</p>
         <Swiper 
         modules={[Navigation,Pagination, Scrollbar, A11y]}
         slidesPerView={1}
         pagination={{clickable:true}}
         navigation
         style={{height:"320px", "--swiper-pagination-color": "#fff",
                 "--swiper-navigation-color": "#fff",}} 
          >
           
           
          {listings.map(({data,id})=>(
           <SwiperSlide key={id} onClick={()=>navigate(`/category/${data.type}/${id}`)}>
           <div 
           style={{
            background:`url(${data?.imgUrls[0]}) center no-repeat`,
            backgroundSize:'cover',
              
           }}
           className="modifiedSwiperSlideDiv">
            <p className="swiperSlideText">{data?.name}</p>
            <div className="swiperSlidePrice">
              ${data?.discountedPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? data?.regularPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }{' '}
              {data?.type === 'rent' && '/ monthly'}
            </div>
           </div>
           </SwiperSlide>
          ))}
         </Swiper>
      </>
    )
   )
}

export default Slider