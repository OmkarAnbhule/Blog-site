import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BlogList from './BlogList';
import { Buffer } from 'buffer'


export default function Profile() {
    const api = import.meta.env.VITE_API_URL;
    const token = jwtDecode(localStorage.getItem('token')) || null
    const [user, setUser] = useState()
    const location = useLocation()
    const [blogs, setBlogs] = useState([])

    const decodeObjectId = (encodedId) => {
        const base64 = encodedId.replace(/-/g, '+').replace(/_/g, '/');
        const buffer = Buffer.from(base64, 'base64');
        return buffer.toString('hex');
    };

    const logout = async () => {
        let result = await fetch(`${api}user/logout`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        result = await result.json()
        if(result.success){
            localStorage.clear()
            window.location.href = '/signup'
        }
    }

    const getUser = async () => {
        let result = await fetch(`${api}user/${decodeObjectId(location.pathname.split('/profile/')[1])}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        result = await result.json()
        return result
    }

    const getBlogs = async () => {
        let result = await fetch(`${api}blog/getBlogs/${token.id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        result = await result.json()
        return result
    }

    useEffect(() => {
        getUser().then((res) => {
            if (res.success) {
                setUser(res.data)
            }
        })
        getBlogs().then((res) => {
            if (res.success) {
                setBlogs(res.data)
            }
        })
    }, [])
    if (user) {
        return (
            <div className='profile-root'>
                <div className='profile-container'>
                    <button onClick={logout}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                        </svg>&nbsp;&nbsp;
                        Logout</button>
                    <div className='profile'>
                        <img src={user.avatar} alt='avatar' />
                        <div className="text">
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                        </div>
                    </div>
                </div>
                <div className='stats'>
                    <p>{blogs.length} Blogs</p>
                    {user.views ? <p>{user.views} Views</p> : null}
                </div>
                <BlogList blogs={blogs} itemsPerPage={6} />
            </div>
        )
    }
}
