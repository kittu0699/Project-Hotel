import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import About from './Components/About/about';
import Testimonial from "./Components/Testimonials/Testimonial"
import Services from './Components/Services/service';
import NavBar from './Components/Navbar/nav';
import HotelBookingPage from "./Components/booking/Bookingpage"
import Adminlogin from "./Components/admin/admin"
import Header from './Components/Header/header';
import Room from './Components/Rooms/Room';




const App = () => {
  return (
    <div>
       <BrowserRouter>
       <NavBar/>
       <Routes>
         <Route path='/' Component={Header} />
         <Route path='about' Component={About} />
         <Route path='rooms' Component={Room} />
         <Route path='testimonial' Component={Testimonial} />
         <Route path='services' Component={Services} />
         <Route path='booking' Component={HotelBookingPage} />
         <Route path='login' Component={Adminlogin} />
       </Routes>
       </BrowserRouter>
    </div>
  )
}

export default App