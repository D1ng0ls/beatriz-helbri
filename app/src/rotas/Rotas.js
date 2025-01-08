import React from 'react';
import { Route, Routes, useLocation, matchPath } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import Index from './../pages/index/Index';
import Feed from './../pages/feed/Feed';
import Sobre from './../pages/sobre/Sobre';
import Contato from '../pages/contato/Contato';
import Register from '../pages/login/Register';
import Login from '../pages/login/Login';
import ChangePassword from '../pages/login/ChangePassword';
import User from '../pages/user/User';
import Post from '../pages/post/Post';
import PostRedirect from '../pages/post/PostRedirect';
import Forms from '../pages/forms/Forms';

const Rotas = () => {
  const location = useLocation();

  const isPostPage = matchPath("/post/:categoriaUrl/:title", location.pathname);

  React.useEffect(() => {
    if (location.pathname === '/') {
      require('./../pages/index/index.css');
    } else if (location.pathname === '/feed') {
      require('./../pages/feed/feed.css');
    } else if (location.pathname === '/sobre') {
      require('./../pages/sobre/sobre.css');
    } else if (location.pathname === '/contato') {
      require('./../pages/contato/contato.css');
    } else if (isPostPage) {
      require('./../pages/post/post.css');
    } else if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/changepassword') {
      require('./../pages/login/login.css');
    } else if (location.pathname === '/user') {
      require('./../pages/user/user.css');
    } else if (location.pathname === '/insertpost') {
      require('./../pages/forms/forms.css');
    }
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Index/>} />
          <Route path="/feed" element={<Feed/>} />
          <Route path="/sobre" element={<Sobre/>} />
          <Route path="/contato" element={<Contato/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/changepassword" element={<ChangePassword/>} />
          <Route path="/user" element={<User/>} />
          <Route path="/post" element={<PostRedirect/>} />
          <Route path="/post/:categoria" element={<PostRedirect/>} />
          <Route path="/post/:categoriaUrl/:title" element={<Post/>} />
          <Route path="/insertpost" element={<Forms/>} />
        </Route>
      </Routes>
    </>
  );
};

export default Rotas;