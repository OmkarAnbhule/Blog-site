import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import 'react-quill/dist/quill.snow.css';
import './style.css'
import Comment from './Comment';


export default function Blog() {
    const api = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()
    const [blog, setBlog] = useState('')
    const location = useLocation()
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])


    const getComments = async () => {
        let result = await fetch(`${api}blog/getComments/${location.pathname.split('/blog/')[1]}`, {
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
        if (localStorage.getItem('token')) {
            setInterval(() => {
                getComments().then((res) => {
                    if (res.success) {
                        setComments(res.data)
                    }
                })
            }, 2000)
        }
    }, [])

    const formatDate = (date) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options).toUpperCase();
    };

    const getBlog = async () => {
        let result = await fetch(`${api}blog/${location.pathname.split('/blog/')[1]}`, {
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

    const getProfile = () => {
        navigate(`/profile/${blog.author._id}`)
    }

    const addView = async () => {
        let result = await fetch(`${api}blog/addView/${location.pathname.split('/blog/')[1]}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getBlog().then((res) => {
                if (res.success) {
                    setBlog(res.data)
                }
            })
                addView()
        }
    }, [])

    const handleComment = async (id) => {
        let result = await fetch(`${api}blog/addComment`, {
            method: 'post',
            body: JSON.stringify({
                comment: comment,
                type: 'comment',
                name: blog.author.name,
                blogId: id,
            }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
    }

    if (blog) {
        return (
            <div className='blog-root'>
                <div className='blog-header'>
                    <h1>{blog.title}</h1>
                    <p>{blog.desc}</p>
                </div>
                <div className='author-info'>
                    <div className='profile' onClick={getProfile}>
                        <img src={blog.author.avatar}></img>
                        <p>By {blog.author.name}</p>
                    </div>
                    <div className='blog-data'>
                        <p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            {formatDate(blog.timeStamp)}
                        </p>
                        <p>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                            </svg>
                            {blog.viewsCount} views
                        </p>

                    </div>
                </div>
                <div className='ql-editor' dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                <div className='comment-section' >
                    <h1>Comments Section</h1>
                    <div className='comment-input-section'>
                        <input type='text' placeholder='add your comment here...' value={comment} onChange={(e) => setComment(e.target.value)}></input>
                        <button onClick={() => handleComment(location.pathname.split('/blog/')[1])}>Comment</button>
                    </div>
                    <div className='comments-scroll'>
                        {
                            comments.map((comment, index) => (
                                <Comment comments={comment} index={index} level={0} key={'0' + index} />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}
