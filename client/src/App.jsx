import './App.css'
import CreateBlog from './components/Blog/Create'
import Home from './components/Home/Home'
import Navbar from './components/Navbar/Navbar'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import AuthForm from './components/User/AuthForm'
import { useEffect, useState } from 'react'
import ScrollToTop from './components/ScrollToTop'
import Blog from './components/Blog/Blog'
import Profile from './components/User/Profile'
import Explore from './components/Home/Explore'
import NotFound from './components/Home/NotFound'

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}
function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const authToken = getCookie('USR_TKN');
    if (authToken)
      setToken(authToken);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('isLogin', 'true');
    } else {
      localStorage.clear()
    }
  }, [token]);
  return (
    <div className='app'>
      <BrowserRouter>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/blog/create' element={<CreateBlog />} />
          <Route path='/login' element={<AuthForm login={true} />} />
          <Route path='/signup' element={<AuthForm login={false} />} />
          <Route path='/blog/:id' element={<Blog />} />
          <Route path='/profile/:id' element={<Profile />} />
          <Route path='/blogs' element={<Home isHome={true} />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='*' element={<NotFound text={"Sorry, we couldn't find this page"}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
