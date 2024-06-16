import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Card({ item }) {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);


    const formatDate = (date) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options).toUpperCase();
    };
    return (
        <div className='card'>
            <div className='inner'>
                <div className="front">
                    <div>
                        {isLoading ? (
                            <Skeleton height={150} width={250} />
                        ) : (
                            <img src={item.thumbnail} alt={item.title} />
                        )}
                        <p className='card-tag'>
                            {isLoading ? <Skeleton width={80} /> : item.category}
                        </p>                    </div>
                </div>
                <div className="back">
                    <div className='hover-back'>
                        <h2>{isLoading ? <Skeleton width={200} /> : item.title}</h2>
                        <div className='info'>
                            <p onClick={()=>navigate(``)}>By {isLoading ? <Skeleton width={100} /> : item.author.name ?? 'user123'}</p>
                            <p>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                {isLoading ? <Skeleton width={60} /> : formatDate(item.timeStamp)}
                            </p>
                            <p>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                                </svg>
                                {isLoading ? <Skeleton width={40} /> : `${item.viewsCount} views`}
                            </p>
                        </div>
                        <div className='desc'>
                            <p>
                                {isLoading ? <Skeleton count={3} /> : item.desc ?? 'description'}
                            </p>
                        </div>
                        <p className='read-more' onClick={() => navigate(`/blog/${item._id}`)}>{isLoading ? <Skeleton width={100} /> : 'Read More'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
