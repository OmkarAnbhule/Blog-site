import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Card from '../Home/Card';

const BlogList = ({ blogs, itemsPerPage }) => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(blogs.length / itemsPerPage);

    const handleClick = (page) => {
        setCurrentPage(page);
    };

    const renderBlogs = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const selectedBlogs = blogs.slice(startIndex, startIndex + itemsPerPage);
        return selectedBlogs.map((item, index) => (
            <Card item={item} key={index} />
        ));
    };

    const renderPagination = () => {
        return (
            <div className='pagination'>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={index + 1 === currentPage ? 'active' : ''}
                        onClick={() => handleClick(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className='blog-list-root'>
            <div className='blog-list'>
                {renderBlogs()}
            </div>
            {totalPages <= 1 ? null : renderPagination()}
        </div>
    );
};

export default BlogList;
