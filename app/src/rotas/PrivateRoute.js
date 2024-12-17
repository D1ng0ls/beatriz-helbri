import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './../library/header/Header'
import Footer from './../library/footer/Footer'

const PrivateRoute = () => {
  return (
    <>
      <Header/>
        <Outlet/>
      <Footer/>
    </>
  )
}

export default PrivateRoute