import {Link} from 'react-router-dom'
import Slider from '../components/Slider'
import rentCarImage from '../assets/DodgeChallengerSRT.jpg'
import sellCar from '../assets/Ford Mustang.jpg'


function Home() {
  return (
   <div className="explore">
    <header>
      <p className="pageHeader">Home</p>
    </header>
    <Slider/>
    <main>
      <p className="exploreCategoryHeading">Categories</p>
      <div className="exploreCategories">
        <Link to='/category/rent'>
        <img src={rentCarImage}
             alt='rent'
             className='exploreCategoryImg'
         />
         <p className="exploreCategoryName">Cars for rent</p>
         </Link>
         <Link to='/category/sale'>
        <img src={sellCar}
             alt='rent'
             className='exploreCategoryImg'
         />
         <p className="exploreCategoryName">Cars for sale</p>
         </Link>
      </div>
      
    </main>
  
   </div>
  )
}

export default Home