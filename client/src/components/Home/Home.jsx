import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import './style.css'
import Card from './Card'

export default function Home({ isHome }) {
    const api = import.meta.env.VITE_API_URL
    const [blogs, setBlogs] = useState([])
    const divRef = useRef(null)

    const getBlogs = async () => {
        let result = await fetch(`${api}blog/getAllBlogs`, {
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
        if (localStorage.getItem('isLogin')) {
            getBlogs().then((res) => {
                if (res.success) {
                    setBlogs(res.data)
                    console.log(blogs[0])
                }
            })
        }
        if (divRef.current) {
            divRef.current.scrollTop = -99999999;
        }
    }, [])

    return (
        <div className='home-root' ref={divRef}>
            <div className='main-root' style={{ width: !isHome ? '65%' : '100%' }}>
                <h1>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>Our Stories</h1>
                <div className='card-wrapper'>
                    {
                        blogs.map((item, index) => (
                            <Card item={item} key={index} />
                        ))
                    }
                </div>
            </div>
            {
                !isHome &&
                <div>
                    <Sidebar />
                </div>
            }
        </div>
    )
}
