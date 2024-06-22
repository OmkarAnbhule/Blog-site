import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import { jwtDecode } from 'jwt-decode';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Comment({ comments, index, level }) {
    const api = import.meta.env.VITE_API_URL;
    const margin = level * 20
    const [isReplyInputShow, setIsReplyInputShow] = useState(false);
    const token = jwtDecode(localStorage.getItem('token') || '')
    const [reply, setReply] = useState('');
    const replyInputRef = useRef(null);
    const [isShowReply, setIsShowReply] = useState(false);
    const [time, setTime] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const handleReply = (e) => {
        let temp = e.target.value;
        temp = temp.replace(/^\s+/g, '');
        setReply(temp);
    }

    function formatRelativeTime(timestamp) {
        const currentDate = new Date();
        const providedDate = new Date(timestamp);

        const timeDifference = currentDate - providedDate;
        const secondsDifference = Math.floor(timeDifference / 1000);
        const minutesDifference = Math.floor(secondsDifference / 60);
        const hoursDifference = Math.floor(minutesDifference / 60);
        const daysDifference = Math.floor(hoursDifference / 24);

        if (daysDifference >= 1) {
            return `${daysDifference}d`;
        } else if (hoursDifference >= 1) {
            return `${hoursDifference}h`;
        } else if (minutesDifference >= 1) {
            return `${minutesDifference}m`;
        } else {
            return `${secondsDifference}s`;
        }
    }

    const handleCommentReply = async () => {
        try {
            let result = await fetch(`${api}blog/addComment`, {
                method: 'post',
                body: JSON.stringify({
                    comment: reply,
                    type: 'reply',
                    name: comments.name,
                    objId: comments._id,
                    blogId: comments.blogId,
                    index: index,
                    level: level
                }),
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            result = await result.json()
            if (result.Response == 'Success') {
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    const handleDelete = async () => {
        let result = await fetch(`${api}blog/deleteComment/${comments._id}/${level}`, {
            method: 'delete',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        result = await result.json();
        if (result.Response == 'Success') {
        }
    }

    const handleReplyShow = () => {
        setIsReplyInputShow(true);
        setTimeout(() => {
            replyInputRef.current.focus();
        }, 10)
    }
    useEffect(() => {
        setTime(formatRelativeTime(comments.timestamp));
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);
    return (
        <div style={{ marginBottom: '10px' }}>
            <div style={{ marginLeft: `${margin}px` }} className='comment'>
                {isLoading ? (
                    <>
                        <Skeleton width={150} />
                        <Skeleton count={2} />
                    </>
                ) : (
                    <>
                        <p className='username'>{comments.name}&nbsp;<small style={{ fontSize: '12px' }}>{time}</small></p>
                        <p className='text'>{comments.comment}</p>
                        <div className='btn-grp'>
                            <button className='btn-reply' onClick={handleReplyShow}>Reply</button>
                            {
                                token.id === comments.id &&
                                <button className='btn-delete' onClick={handleDelete}>
                                    <i className='bi bi-trash-fill'></i>
                                </button>
                            }
                        </div>
                    </>
                )}
            </div>
            {
                comments.isReply && !isShowReply && comments.replyCount > 0 ? (
                    <div className='reply-show-btn' style={{ marginLeft: `${margin}px` }}>
                        <button onClick={() => setIsShowReply(true)}>Show Replies ({comments.replyCount})</button>
                    </div>
                ) : comments.replyCount > 0 && (
                    <div className='reply-show-btn' style={{ marginLeft: `${margin}px` }}>
                        <button onClick={() => setIsShowReply(false)}>Hide Replies</button>
                    </div>
                )
            }
            {
                isReplyInputShow && (
                    <div className='reply-input' style={{ marginLeft: `${margin}px` }}>
                        <input
                            type='text'
                            placeholder='Reply'
                            value={reply}
                            tabIndex={0}
                            ref={replyInputRef}
                            onBlur={() => { setTimeout(() => { setIsReplyInputShow(false) }, 2000) }}
                            onChange={handleReply}
                        />
                        <button className='btn-reply' onClick={handleCommentReply}>
                            {`Reply to ${comments.name}`}
                        </button>
                    </div>
                )}
            {
                comments.isReply && isShowReply && comments.Replies.map((reply, index) => (
                    <Comment comments={reply} level={level + 1} index={index} key={`${level}${index}`} />
                ))}
        </div>
    )
}
