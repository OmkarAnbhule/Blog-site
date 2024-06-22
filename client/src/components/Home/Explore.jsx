import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './style.css'
import NotFound from './NotFound';
import BlogList from '../User/BlogList';

export default function Explore() {
    const api = import.meta.env.VITE_API_URL;
    const location = useLocation()
    const value = location.state.search
    const [search, setSearch] = useState(value || '')
    const [blogs, setBlogs] = useState([])

    const handleSearch = async () => {
        let result = await fetch(`${api}blog/getQueryBlog/${search.trim()}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        result = await result.json()
        if (result.success) {
            setBlogs(result.data)
        }
    }

    useEffect(() => {
        console.log(search)
        if (search != '' || location.search != '') {
            handleSearch()
        }
    }, [])

    return (
        <div className='explore-root'>
            <div className='input-search'>
                <input type='text' className='input' placeholder='Enter your keyword?' value={search} onKeyDown={(e) => { if (e.key == 'Enter') { handleSearch() } }} onChange={(e) => { setSearch(e.target.value) }}></input>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-6" onClick={handleSearch}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>

            {
                blogs && blogs.length > 0 ?
                    <BlogList blogs={blogs} itemsPerPage={9} />
                    :
                    <NotFound text={"Sorry, we couldn't find this blog"}/>
            }
        </div>
    )
}
