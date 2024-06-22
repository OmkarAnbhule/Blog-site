import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './style.css';

const shapes = ['square'];

const getRandomShape = () => {
    const randomIndex = Math.floor(Math.random() * shapes.length);
    return shapes[randomIndex];
};

const getRandomPosition = () => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    return { x, y };
};

const NotFound = ({ text }) => {
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPositions(positions =>
                positions.map(() => getRandomPosition())
            );
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const initialPositions = new Array(15).fill(0).map(() => getRandomPosition());
        setPositions(initialPositions);
    }, []);

    return (
        <div className="shapes-container">
            {positions.map((position, index) => (
                <motion.div
                    key={index}
                    className={`shape ${getRandomShape()}`}
                    animate={{
                        x: position.x,
                        y: position.y,
                    }}
                    transition={{
                        duration: 2,
                        ease: 'easeInOut',
                    }}
                >
                </motion.div>
            ))}
            <div className='not-found-root'>
                <div className='number'>
                    <h1>4</h1>
                    <h1>0</h1>
                    <h1>4</h1>
                </div>
                <div className='text'>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;