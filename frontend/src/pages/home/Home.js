import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="centered-container">
            <h1 className="title" style={{ marginTop: '36px', marginBottom: '16px' }}>CarbonWise</h1>
            <p style={{ fontSize: '36px', fontWeight: '700', margin: '0 auto' }}>Dearborn's journey to sustainability starts here.</p>
            <p style={{ fontSize: '32px', margin: '36px auto', textAlign: 'center' }}>Calculate your carbon footprint and start your sustainability journey today!</p>
            <Button
                label="Carbon Footprint Calculator"
                onClick={() => navigate('/calculator')}
                variant="primary"
                style={{ fontSize: '32px', width: '600px' }}
            />
            <Button
                label="Sustainability Recommendations"
                onClick={() => navigate('/recommendations')}
                variant="accent"
                style={{ fontSize: '32px', width: '600px' }}
            />
        </div>
    );
};

export default Home;