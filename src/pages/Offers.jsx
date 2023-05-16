import { useEffect,useState } from "react"
 import{
 collection,
 getDocs,
 query,
 where,
 orderBy,
 limit,
 startAfter,
 getCountFromServer,
}from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from "../components/Spinner"
import ListingItem from "../components/ListingItem"

const Offers = () => {
 const [listings, setListings]=useState(null)
 const [loading, setLoading]= useState(true)
 const [lastFetchedListing,setLastFetchedListing]= useState(null)
  const [count, setCount]=useState(null);

 
 useEffect(()=>{
   const fetchListings=async()=>{
     try{
      // reference from listings collection
      const listingsRef=collection(db,'listings')

      const countQuery=query(listingsRef,
        where("offer", "==",true ),
        
        )
        const countDocs= await getCountFromServer(countQuery)
        setCount(countDocs.data().count);

      //Here a query is created
      const q= query(listingsRef, 
       where('offer', '==', true),
       orderBy('timestamp', 'desc'),
       limit(10)
       )

       //Execute query
       const querySnap=await getDocs(q)

       const lastElement=querySnap.docs[querySnap.docs.length -1]
       setLastFetchedListing(lastElement)
       
       //Array listing 
       let listings=[]

       //Loop through querySnap using a forEach loop
        querySnap.forEach((doc)=> {
         // push object into listing
         return listings.push({
           id: doc.id,
           data:doc.data()
         })
        })

        //setListings to listings
        setListings(listings)

        //Set Loader to false
        setLoading(false)
         
     }
     catch(error){
      toast.error('Could not fetch listings')
     }
   }
   fetchListings()
 },[])

  //Pagination 
  const onFetchMoreListings=async()=>{
    try{
     // reference from listings collection
     const listingsRef=collection(db,'listings')

     //Here a query is created
     const q= query(listingsRef, 
      where('offer', '==', true),
      orderBy('timestamp', 'desc'),
      startAfter(lastFetchedListing),
      limit(10)
      )

      //Execute query
      const querySnap=await getDocs(q)

      const lastElement=querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastElement)
      //Array listing 
      const listings=[]

      //Loop through querySnap using a forEach loop
       querySnap.forEach((doc)=> {
        // push object into listing
        return listings.push({
          id: doc.id,
          data:doc.data()
        })
       })

       //setListings to listings
 
       //Set Loader to false
       setListings((prevState)=> [...prevState, ...listings])
       setLoading(false)
        
    }
    catch(error){
     toast.error('Could not fetch listings')
    }
  }


 return (
   <div className="category">
     <header>
       <p className="pageHeader">
        Offers
       </p>
     </header>
     {loading ? (
       <Spinner />
     ) : listings && listings.length > 0 ? (
       <>
         <main>
           <ul className="categoryListings">
             {listings.map((listing) =>(
               <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
              ))}
           </ul>
         </main>
         <br />
          <br />
          {lastFetchedListing && listings?.length < count && (
            <p className="loadMore" onClick={onFetchMoreListings}>More Listing</p>
          )}
       </>
     ) :(
        <p class="listing-paragraph">There are no available offers at the moment</p>
     )}
   </div>
 )
}

export default Offers