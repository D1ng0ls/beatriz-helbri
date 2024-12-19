import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import Index from './../pages/index/Index';
import Feed from './../pages/feed/Feed';

const Rotas = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (location.pathname === '/') {
      require('./../pages/index/style.css');
    } else if (location.pathname === '/feed') {
      require('./../pages/feed/style.css');
    } // else if (location.pathname === '/eventos') {
//       require('./../style/pages/eventos/style.css');
//     } else if (location.pathname === '/posts') {
//       require('./../style/pages/posts/style.css');
//     } else if (location.pathname === '/sobre') {
//       require('./../style/pages/sobre/style.css');
//       require('./../style/pages/sobre/mobile.css');
//     } else if (location.pathname === '/faq') {
//       require('./../style/pages/faq/style.css');
//       require('./../style/pages/faq/mobile.css');
//     } else if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/changepassword') {
//       require('./../style/pages/login/style.css');
//     } else if (location.pathname === '/user') {
//       require('./../style/pages/user/style.css');
//     }
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
        <Route path="/" element={<Index/>} />
        <Route path="/feed" element={<Feed/>} />
        </Route>
      </Routes>
    </>
  );
};

export default Rotas;