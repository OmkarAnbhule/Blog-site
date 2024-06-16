import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';


export default function Sidebar() {
    const api = import.meta.env.VITE_API_URL
    const navigate = useNavigate()
    const [end, setEnd] = useState(false);
    const [recentBlogs, setRecentBlogs] = useState([])
    const [popularBlogs, setPopularBlogs] = useState([])
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const divRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const formatDate = (date) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options).toUpperCase();
    };
    const recentBlog = async () => {
        let result = await fetch(`${api}blog/recentBlog`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        result = await result.json()
        return result
    }


    const popularBlog = async () => {
        let result = await fetch(`${api}blog/popularBlog`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        result = await result.json()
        return result
    }

    const handleSearch = async () => {
        navigate('/explore', {
            state: {
                search: search
            }
        })
    }

    useEffect(() => {
        recentBlog().then((res) => {
            if (res.success) {
                setRecentBlogs(res.data)
            }
        })
        popularBlog().then((res) => {
            if (res.success) {
                setPopularBlogs(res.data)
            }
        })
    }, [])

    const slide = () => {
        setTimeout(() => {
            if (end) {
                scrollLeft()
            }
            else {
                scrollRight()
            }
            slide()
        }, 1000 * 2);
    }
    useEffect(() => {
        slide()
    }, [end])

    const scrollLeft = () => {
        if (Math.floor(divRef.current.scrollLeft) === 0) {
            setEnd(false);
        } else {
            divRef.current.scrollTo({
                left: divRef.current.scrollLeft - divRef.current.clientWidth,
                behavior: 'smooth',
            });
        }
    };

    const scrollRight = () => {
        const maxScrollLeft = divRef.current.scrollWidth - divRef.current.clientWidth - 3;
        if (Math.floor(divRef.current.scrollLeft) >= maxScrollLeft) {
            setEnd(true);
        } else {
            divRef.current.scrollTo({
                left: divRef.current.scrollLeft + divRef.current.clientWidth,
                behavior: 'smooth',
            });
        }
    };

    const handleBlog = (id) => {
        navigate(`/blog/${id}`)
    }

    return (
        <div className='sidebar-root'>
            <div className='input-search'>
                <input type='text' className='input' placeholder='Enter your keyword?' value={search} onKeyDown={(e) => { if (e.key == 'Enter') { handleSearch() } }} onChange={(e) => { setSearch(e.target.value) }}></input>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-6" onClick={handleSearch}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>
            <div className='popular-posts'>
                <h1>Popular Posts</h1>
                <div className='caraousel' ref={divRef}>
                    {
                        isLoading ? (
                            Array(3).fill().map((_, index) => (
                                <div className='blog' key={index}>
                                    <Skeleton height={100} width={100} />
                                    <div className='title'>
                                        <p><Skeleton width={150} /></p>
                                        <p><Skeleton width={100} /></p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            popularBlogs && popularBlogs.map((item, index) => (
                                <div className='blog' key={index} onClick={() => handleBlog(item._id)}>
                                    <img src={item.thumbnail} alt={item.title} />
                                    <div className='title'>
                                        <p>{item.title}</p>
                                        <p>Title of the blog</p>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
            <div className='recent-posts'>
                <h1>Recent Posts</h1>
                {
                    isLoading ? (
                        Array(5).fill().map((_, index) => (
                            <div className='post' key={index}>
                                <Skeleton height={60} width={100} />
                                <div className='post-text'>
                                    <p><Skeleton width={100} /></p>
                                    <p><Skeleton width={80} /></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        recentBlogs && recentBlogs.map((item, index) => (
                            <div className='post' key={index} onClick={() => handleBlog(item._id)}>
                                <img src={item.thumbnail} alt={item.title} width={50} height={50} />
                                <div className='post-text'>
                                    <p>{item.title}</p>
                                    <p>{formatDate(item.timeStamp)}</p>
                                </div>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    )
}
