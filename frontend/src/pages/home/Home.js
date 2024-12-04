import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="centered-container vertical-center">
            <h1 className="title" style={{ marginTop: '0', marginBottom: '16px' }}>CarbonWise</h1>
            <p style={{ fontSize: '32px', fontWeight: '700', margin: '0 auto', textAlign: 'center' }}>Dearborn's journey to sustainability starts here.</p>
            <p style={{ fontSize: '28px', margin: '36px auto', textAlign: 'center' }}>Calculate your carbon footprint and start your sustainability journey today!</p>
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
    );
};

export default Home;