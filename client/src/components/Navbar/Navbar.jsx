import React, { useEffect, useState } from 'react'
import './style.css'
import logo from '../../assets/react.svg'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';
import { Buffer } from 'buffer'

export default function Navbar() {
    const api = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()
    const location = useLocation()
    let token = null
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null)
    const handleNavigate = (path) => {
        navigate(path)
    }

    const getUser = async () => {
        let result = await fetch(`${api}user/${token.id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        result = await result.json()
        if (result.success) {
            return result
        }
        return null
    }

    useEffect(() => {
        if (localStorage.getItem('isLogin')) {
            setTimeout(() => {
                getUser().then((res) => {
                    if (res.success) {
                        setUser(res.data)
                    }
                })
            }, 1000)
            token = jwtDecode(localStorage.getItem('token'))
        }
    }, [localStorage.getItem('token')])

    const encodeObjectId = (objectId) => {
        const buffer = Buffer.from(objectId.toString(16), 'hex');
        return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };

    const checkIfOpen = (path) => {
        return location.pathname === path
    }
    return (
        <div className='navbar-root'>
            <Link to={'/'}>
                <div className='logo'>

                    <img src={logo} width={50} height={50} />
                    <div>
                        <p className='satisfy-regular'>Ink Wave</p>
                        <p>Dive into Ideas</p>
                    </div>
                </div>
            </Link>
            <label htmlFor='radio' onClick={() => setIsOpen(!isOpen)}>
                {
                    isOpen ?
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                }
            </label>

            <input type='checkbox' value={isOpen} id='radio' hidden></input>

            <div className='nav-links'>
                {
                    localStorage.getItem('isLogin') ?
                        <>
                            <div title="let's go to home" className={`${checkIfOpen('/') ? 'active' : null}`}>
                                <Link to={'/'}>
                                    <p>Home</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                    </svg>
                                </Link>
                            </div>
                            <div title='see new blogs' className={`${checkIfOpen('/blogs') ? 'active' : null}`}>
                                <Link to={'/blogs'}>
                                    <p>Blogs</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                                    </svg>
                                </Link>
                            </div>
                            <div title='create a new blog' className={`${checkIfOpen('/blog/create') ? 'active' : null}`}>
                                <Link to={'/blog/create'}>
                                    <p>New Blog</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </Link>
                            </div>
                        </>
                        : null
                }
                <div className='profile-btn'>
                    {
                        localStorage.getItem('isLogin') && user ?
                            <Link to={`/profile/${encodeObjectId(token.id)}`}>
                                <div className='profile'>
                                    <img width={50} height={50} src={user.avatar}></img>
                                    <p>{user.name}</p>
                                </div>
                            </Link>
                            :
                            <div className='btn-grp'>
                                <button onClick={() => handleNavigate('/signup')}>Signup</button>
                                <button onClick={() => handleNavigate('/login')}>Login</button>
                            </div>
                    }
                </div>
            </div>




        </div >
    )
}
