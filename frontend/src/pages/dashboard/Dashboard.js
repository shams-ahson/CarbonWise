import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalEmissions } = location.state || {};

    return (
        <div className="centered-container">
            <h1>Carbon Footprint Results</h1>
            {totalEmissions !== undefined ? (
                <div className="centered-container">
                    <p>Your Total Carbon Footprint: {totalEmissions.toFixed(2)} CO2 tons/year</p>

                    <h1>Sustainability Recommendations</h1>
                    <p>Here are some recommendations to offset your carbon footprint based on your results.</p>
                </div>
            ) : (
                <div>
                    <p>Please complete the calculator quiz in order to understand your carbon footprint!</p>
                    
                    <Button
                        label="Take Carbon Footprint Calculator Quiz"
                        onClick={() => navigate('/calculator')}
                        variant="accent"
                        style={{ fontSize: '24px', width: '600px', fontWeight: '200' }}
                    />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
