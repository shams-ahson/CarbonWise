import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import './Home.css';
import footprintImage from './footprints.png';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const cursorFootprint = document.querySelector('.cursor-footprints');
        let lastPosition = { x: 0, y: 0 };
        let isLeftFoot = true; // toggle btwn left and right footsteps

        const handleMouseMove = (e) => {
            const dx = e.pageX - lastPosition.x;
            const dy = e.pageY - lastPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 95) return; // to adjust spacing

            lastPosition = { x: e.pageX, y: e.pageY };

            const footprint = document.createElement('img');
            footprint.src = footprintImage;
            footprint.className = 'footprint';
            
            // alternate left and right footprints
            const offset = isLeftFoot ? -20 : 20; // offset footprints left/right
            footprint.style.left = `${e.pageX + offset}px`;
            footprint.style.top = `${e.pageY}px`;
            isLeftFoot = !isLeftFoot;

            cursorFootprint.appendChild(footprint);

            // remove footprint after short delay
            setTimeout(() => {
                footprint.remove();
            }, 4000);
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="home-container">
            <h1 className="title">CarbonWise</h1>
            <p className="subtitle">Dearborn's journey to sustainability starts here.</p>
            <p className="description">
                Calculate your carbon footprint and start your sustainability journey today!
            </p>
            <div className="buttons">
                <Button
                    label="Login"
                    onClick={() => navigate('/login')}
                    variant="primary"
                    style={{ fontSize: '32px', width: '600px', fontWeight: '200' }}
                />
                <Button
                    label="Create an Account"
                    onClick={() => navigate('/register')}
                    variant="accent"
                    style={{ fontSize: '32px', width: '600px', fontWeight: '200' }}
                />
            </div>
            {/* cursor footprint tracking */}
            <div className="cursor-footprints"></div>
        </div>
    );
};

export default Home;
