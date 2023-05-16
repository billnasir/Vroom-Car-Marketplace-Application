import {useState, useEffect, useRef} from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
 import {useNavigate} from 'react-router-dom'
 import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
 import { addDoc, collection, serverTimestamp } from "firebase/firestore"; 
 import {v4 as uuidv4} from 'uuid'
 import {db} from '../firebase.config'
 
function CreateListing(){
  //API KEY
  const apiKey = import.meta.env.VITE_API_KEY
 

  
const[geolocationEnabled, setGeolocationEnabled]=useState(true)
const [loading, setLoading]= useState(false)
 const [formData, setFormData]=useState({
  type:'rent',
  name: '',
  model:'',
  carType:'',
  year: 2023,
  seats:2,
  offer:false,
  address:'',
  colour:'',
  fuelType:"",
  images:{},
  company:"",
  condition:"used",
  regularPrice:0,
  discountedPrice:0,
  latitiude:0,
  longitude:0
})

const {type,name, seats,model,company, condition,
       regularPrice,discountedPrice,images, year, offer,
       address,fuelType,colour,latitiude,carType }= formData

const auth= getAuth()
const navigate= useNavigate()
const isMounted=useRef(true)

useEffect(() =>{
  if(isMounted){
   onAuthStateChanged(auth, (user) =>{
     if(user){
      //Set Form data,  spread the formData and add userRef
      setFormData({...formData, userRef: user.uid})
     }else{
      navigate('/sign-in')
     }
   })
  }
  return() =>{
    isMounted.current= false
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps

}, [isMounted])

const onSubmit=async (e)=>{
  e.preventDefault()

  setLoading(true)
  
  if(discountedPrice >= regularPrice){
   setLoading(false)
   toast.error('Discounted price should not exceed the regular price!')
   return
  }
 
  if(images.length > 4){
    setLoading(false)
    toast.error('Maximum limit is 4 images')
    return
  }

  //Create a geolocation object
  let geolocation={}
  let location

  if(geolocationEnabled){
    const response= await fetch(`https://api.geoapify.com/v1/geocode/search?text=${address}&format=json&apiKey=${apiKey}`)
    const data= await response.json()

    //Use Nullish Coalescing Operator for geolocation
                     //if it is null  it will equal 0
    geolocation.lat= data.results[0]?.lat ?? 0
    geolocation.lng=data.results[0]?.lon ?? 0

    location=data? data.results[0]?.formatted : undefined

    if(location === undefined || location.includes('undefined')){
      setLoading(false)
      toast.error('Please enter a correct address')
    }

    console.log(geolocation, location)
    
  }else{
    geolocation.lat=latitiude
    geolocation.lng=longitude
    location=address
    console.log(geolocation,location)
  }
   
  //Create an asychronous function that stores images in firebase
  const storeImage=async(image)=>{
    return new Promise((resolve, reject) =>{
      //Get reference from storage
      const storage= getStorage()

      const fileName=`${auth.currentUser.uid}-${image.name}-${uuidv4()}`
      
      //Create a storage reference
      const storageRef=ref(storage, 'images/' + fileName)
      
      const uploadTask=uploadBytesResumable(storageRef,image);
      
      // Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
uploadTask.on('state_changed', 
(snapshot) => {
  // Observe state change events such as progress, pause, and resume
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  console.log('Upload is ' + progress + '% done');
  switch (snapshot.state) {
    case 'paused':
      console.log('Upload is paused');
      break;
    case 'running':
      console.log('Upload is running');
      break;
  }
}, 
(error) => {
  reject(error)
}, 
() => {
  // Handle successful uploads on complete
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    resolve(downloadURL)
  });
}
);
      
    })
  }
    //Promise.all accepts an array of promises
  const imgUrls=await Promise.all(
    //Spread images and contain it in an array   
    [...images].map((image)=> storeImage(image))
  ).catch(()=>{
    setLoading(false)
    toast.error('Images not uploaded')
    return
  })
   console.log(imgUrls)

   //Create a formDataCopy object
   const formDataCopy={
    ...formData,
    imgUrls,
    geolocation,
    timestamp:serverTimestamp()
   }
   formDataCopy.location=address
   //Delete formDataCopy property images and address
   delete formDataCopy.images
   delete formDataCopy.address
   location && (formDataCopy.location= location)

    //If formDataCopy is false then delete formDataCopy.discountedPrice
   !formDataCopy.offer && delete formDataCopy.discountedPrice
  
   //Add formDataCopy to firebase
   const docRef=await addDoc(collection(db, 'listings'), formDataCopy)
   
   //Loading set to false
   setLoading(false)
   
   toast.success('Listing saved')

   //navigate to category page
   navigate(`/category/${formDataCopy.type}/${docRef.id}`)
}

const onMutate=(e)=>{
let boolean=null

if(e.target.value === 'true'){
  boolean=true
}

if(e.target.value === 'false'){
  boolean=false
}

//Files
if(e.target.files){
  setFormData((prevState)=> ({
    ...prevState,
    images:e.target.files
  }))
}
//Text/ Booleans/ Numbers
if(!e.target.files){
  setFormData((prevState)=>({
    ...prevState,
    [e.target.id]: boolean ?? e.target.value
  }))
}

}

if(loading){
  return <Spinner />
}

return (
  <div className="profile">
    <header>
      <p className="pageHeader">Create a Car Listing</p>
    </header>
    <main className='profile-main'>
      <form onSubmit={onSubmit}>
        <label className='formLabel'>Sell / Rent</label>
       <div className="formButtons">
        <button
        type='button'
        className={type === 'sale' ? 'formButtonActive' : 'formButton'}
        id='type'
        value='sale'
        onClick={onMutate}
        >Sell</button>
         <button
        type='button'
        className={type === 'rent' ? 'formButtonActive' : 'formButton'}
        id='type'
        value='rent'
        onClick={onMutate}
        >Rent</button>
       </div>
       <label className="formLabel">Car Name</label>
       <input
       className='formInputName'
       type='text'
       id='name'
       value={name}
       onChange={onMutate}
       maxLength='32'
       minLength='5'
       required
        />

<label className="formLabel">Company</label>
       <input
       className='formInputName'
       type='text'
       id='company'
       value={company}
       onChange={onMutate}
       maxLength='32'
       minLength='4'
       required
        />

        <label className="formLabel">Model</label>
       <input
       className='formInputName'
       type='text'
       id='model'
       value={model}
       onChange={onMutate}
       maxLength='32'
       minLength='4'
       required
        />
        <label className="formLabel">Car Type</label>
        <input
       className='formInputName'
       type='text'
       id='carType'
       value={carType}
       onChange={onMutate}
       maxLength='32'
       minLength='4'
       required
        />


<label className="formLabel">Year</label>
      <input
      className='formInputSmall'
      type='number'
      id='year'
      value={year}
      onChange={onMutate}
      min='1900'
      max='2030'
      />
      <label className="formLabel">Fuel Type</label>
<input
       className='formInputName'
       type='text'
       id='fuelType'
       value={fuelType}
       onChange={onMutate}
       maxLength='32'
       minLength='2'
       required
        />
       
       <label className="formLabel">Color</label>
       <input
       className='formInputName'
       type='text'
       id='colour'
       value={colour}
       onChange={onMutate}
       maxLength='32'
       minLength='2'
       required
        />

<label className="formLabel">Number of Seats</label>
      <input
      className='formInputSmall'
      type='number'
      id='seats'
      value={seats}
      onChange={onMutate}
      min='2'
      max='10'
      />
    
    <label className='formLabel'>Condition</label>
       <div className="formButtons">
        <button
        type='button'
        className={condition === 'new' ? 'formButtonActive' : 'formButton'}
        id='condition'
        value='new'
        onClick={onMutate}
        >New</button>
         <button
        type='button'
        className={condition === 'used' ? 'formButtonActive' : 'formButton'}
        id='condition'
        value='used'
        onClick={onMutate}
        >Used</button>
       </div>
      
      <label className='formLabel'>Address</label>
       <textarea
       className='formInputAddress'
       type='text'
       id='address'
       value={address}
       onChange={onMutate}
       required
       /> 
       <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>

          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}
          {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}
         <label  className="formLabel">Images</label>
          <p className="imagesInfo">The first image will be the cover (will not exceed 4 images).</p>
         <input 
         className='formInputFile'
         type='file'
         id='images'
         onChange={onMutate}
         max='4'
         accept='.jpg,.png,.jpeg'
         multiple
         required
          />
        <button type='submit' className='primaryButton createListingButton'>
          Create Car Listing
        </button>
      </form>
    </main>
  </div>
)
}

export default CreateListing