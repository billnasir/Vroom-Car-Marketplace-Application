 import {Link} from 'react-router-dom'
 import { GiCarSeat } from 'react-icons/gi';
  import { AiFillCar, AiFillDelete,AiFillEdit} from 'react-icons/ai';
  
   
function ListingItem({listing,id, onDelete,onEdit}) {
  return (
     <li className="categoryListing">
      <Link to={`/category/${listing.type}/${id}`}
      className='categoryListingLink'>
        <img src={listing?.imgUrls[0]} 
         alt={listing.name} 
         className='categoryListingImg'
        />

        <div className="categoryListingDetails">
          <p className="categoryListingLocation">
             {listing.location}
          </p>
          <p className="categoryListingName">{listing.name}</p>
          
          <p className="categoryListingPrice">
            ${listing.offer? 
            listing.discountedPrice 
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            {listing.type === 'rent' && '/ Monthly'}
          
          </p>
           <div className="categoryListingInfoDiv">
           <AiFillCar  size={28}/>
           <p className="categoryListingInfoText">
             {listing.carType}
           </p>
           <GiCarSeat  size={28}/>
           <p className="categoryListingInfoText">
            {listing.seats} Car Seats
           </p>
           
            </div>
        </div>
      </Link>
        
        
       {onDelete && (
        <AiFillDelete
        size={28}
         onClick={() => onDelete(listing.id, listing.name)}
         />
       )}
      
      {onEdit && (<AiFillEdit  
        size={28}
        onClick={() => onEdit(id)}
      />)}
     </li>
  )
}

export default ListingItem