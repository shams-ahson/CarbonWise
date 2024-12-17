import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/Button';
import footprints from './footprints.png';
import ResourceCarousel from '../../components/Carousel';
import ResourceCard from '../../components/Card';
import hinespark from './hinespark.jpg';
import "./Dashboard.css";

const parseAIrecommendations = (aiResponse) => {
    const rec_resources = [];
    const resourceRegex = /(.*?)\s\((Bike\/Walk Trail|Public Transportation|Clothes Market|Grocery Store)\)/g;
    let match;
    while ((match = resourceRegex.exec(aiResponse)) !== null) {
        let resourceName = match[1].trim();
        const resourceCategory = match[2].trim();
        resourceName = resourceName.replace(/\(.*?\)/g, "").trim();
        rec_resources.push({ name: resourceName, category: resourceCategory });
    }
    return rec_resources;
    
};

const groupResourcesByCategory = (resources) => {
    return resources.reduce((acc, resource) => {
        if (!acc[resource.category]) {
            acc[resource.category] = [];
        }
        acc[resource.category].push(resource);
        return acc;
    }, {});
};

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalEmissions: initialEmissions } = location.state || {};

    const [totalEmissions, setTotalEmissions] = useState(() => {
        if (initialEmissions) {
            return initialEmissions;
        }
        
        const storedScore = localStorage.getItem('totalEmissions');
        return storedScore ? parseFloat(storedScore) : null;
    });


    const [quizCompleted, setQuizCompleted] = useState(() => {
        const storedQuizStatus = localStorage.getItem('quizCompleted');
        return storedQuizStatus === 'true'; 
    });

    // const [groupedResources, setGroupedResources] = useState({});
    // const [loadingScore, setLoadingScore] = useState(!totalEmissions); 
    // const [loadingResources, setLoadingResources] = useState(true);

    const averageUSEmissions = 16;
    const averageGlobalEmissions = 4;

    const userEmissionsArray = totalEmissions ? Array(Math.round(totalEmissions)).fill(null) : [];
    const averageUSEmissionsArray = Array(averageUSEmissions).fill(null);
    const averageGlobalEmissionsArray = Array(averageGlobalEmissions).fill(null);
    const [groupedResources, setGroupedResources] = useState({});
    const [aiResources, setAIResources] = useState({
        'Bike/Walk Trail': [],
        'Public Transportation': [],
        'Clothes Market': [],
        'Grocery Store': []
    });
    const [loadingScore, setLoadingScore] = useState(!totalEmissions);
    const [loadingResources, setLoadingResources] = useState(true);

    const [matched, setMatchedResources] = useState({
        'Bike/Walk Trail': [],
        'Public Transportation': [],
        'Clothes Market': [],
        'Grocery Store': []
    });


    useEffect(() => {

            const fetchScoreAndResources = async () => {
            const token = localStorage.getItem('authToken');
            const aiResponse =  localStorage.getItem('recommendations');


            const aiResults = parseAIrecommendations(aiResponse);
            console.log("!!!AI RESULTS FROM PARSE",  aiResults);
            const aiGrouped = groupResourcesByCategory(aiResults);
            setAIResources(aiGrouped);
            console.log("AI RESOURCES:", aiResources);


            // Fetch Score
            if (totalEmissions === null || isNaN(totalEmissions)) {
                setLoadingScore(true);
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await axios.get('https://carbonwise-p938.onrender.com/api/quiz/score', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const fetchedScore = response.data.score || 0;


                    if (fetchedScore > 0) {
                        setTotalEmissions(fetchedScore);
                        localStorage.setItem('totalEmissions', fetchedScore);
                    } else if (initialEmissions) {
                        setTotalEmissions(initialEmissions); 
                        localStorage.setItem('totalEmissions', initialEmissions); 
                    }
                } catch (error) {
                    console.error('Error fetching quiz score:', error);
                    if (initialEmissions) {
                        setTotalEmissions(initialEmissions);
                        localStorage.setItem('totalEmissions', initialEmissions);
                    } else {
                        setTotalEmissions(null); 
                    }
                } finally {
                    setLoadingScore(false); 
                }
            } else {
                setLoadingScore(false); 
            }
        };

        fetchScoreAndResources(); 
    }, [totalEmissions, initialEmissions]); 

    useEffect(() => {
        const fetchResources = async () => {
            setLoadingResources(true);
            try {
                const aiResponse = localStorage.getItem('recommendations') || '';
                const aiGrouped = aiResponse ? groupResourcesByCategory(parseAIrecommendations(aiResponse)) : {};

                const resourceResponse = await axios.get('https://carbonwise-p938.onrender.com/api/resources');
                const grouped = groupResourcesByCategory(resourceResponse.data);
                setGroupedResources(grouped);


                if (Object.keys(aiGrouped).length > 0) {
                    const resourceNames = Object.values(aiGrouped)
                        .flat()
                        .map((resource) => resource.name)
                        .join(',');

                    const specificResourceResponse = await axios.get(
                        'https://carbonwise-p938.onrender.com/api/resource-details',
                        { params: { names: resourceNames } }
                    );

                    const matchedResources = {};
                    Object.entries(aiGrouped).forEach(([category, resources]) => {
                        matchedResources[category] = resources
                            .map((resource) => {
                                let match = specificResourceResponse.data.find((r) => r.name === resource.name);
                                if (!match) {
                                    match = resourceResponse.data.find((r) => r.name === resource.name);
                                }
                                return match;
                            })
                            .filter(Boolean);
                    });

                    setMatchedResources(matchedResources);
                    localStorage.setItem('matchedResources', JSON.stringify(matchedResources));
                }
            } catch (error) {
                console.error('Error fetching resources:', error);


                const savedResources = localStorage.getItem('matchedResources');
                if (savedResources) {
                    try {
                        setMatchedResources(JSON.parse(savedResources));
                    } catch (parseError) {
                        console.error('Error parsing saved resources:', parseError);
                    }
                }
            } finally {
                setLoadingResources(false);
            }
        };

        fetchResources(); 
    }, []); 


    return (
        <div className="centered-container">
            <h1 className="title-name">Your Carbon Footprint Score</h1>
            {!quizCompleted ? ( 
                <div>
                    <p>Please complete the calculator quiz in order to understand your carbon footprint!</p>
                    <Button
                        label="Take Carbon Footprint Calculator Quiz"
                        onClick={() => navigate('/calculator')}
                        variant="accent"
                        style={{ fontSize: '24px', width: '600px', fontWeight: '200' }}
                    />
                </div>
            ) : (
                <div className="results-container">
                    <p>The following carbon footprint score has been calculated based on your quiz answers. The American and Global averages can be used to see how your score compares to individuals around the world.</p>


                    <div className="footprint-equivalent">
                        <p>
                            One
                            <img
                                src={footprints}
                                alt="Green Footprint"
                                className="inline-footprint-image"
                            />
                            = One Ton CO₂
                        </p>
                    </div>

                    <div className="image-row">
                        <h3>Your Footprint:</h3>
                        <p>Your total carbon footprint is <strong>{totalEmissions !== null ? totalEmissions.toFixed(2) : 'N/A'}</strong> tons CO₂/year.</p>
                        <div className="image-container">
                            {userEmissionsArray.map((_, index) => (
                                <img
                                    key={`user-footprint-${index}`}
                                    src={footprints}
                                    alt="Green Footprint"
                                    className="footprint-image"
                                />
                            ))}
                        </div>

                        <h3>Average American's Footprint:</h3>
                        <p>The average American's carbon footprint is <strong>16</strong> tons CO₂/year.</p>
                        <div className="image-container">
                            {averageUSEmissionsArray.map((_, index) => (
                                <img
                                    key={`average-footprint-${index}`}
                                    src={footprints}
                                    alt="Green Footprint"
                                    className="footprint-image"
                                />
                            ))}
                        </div>

                        <h3>Average Global Footprint:</h3>
                        <p>The average global carbon footprint is <strong>4</strong> tons CO₂/year.</p>
                        <div className="image-container">
                            {averageGlobalEmissionsArray.map((_, index) => (
                                <img
                                    key={`average-footprint-${index}`}
                                    src={footprints}
                                    alt="Green Footprint"
                                    className="footprint-image"
                                />
                            ))}
                        </div>
                    </div>
                    <h1>Sustainability Recommendations</h1>
                    <h2>Personalized Resources Based on Your Answers</h2>
                    <p>Here are some resources from the categories you can improve in based on your quiz answers.</p>


                    <div>
                        {Object.entries(matched).map(([category, resources]) => (
                            <div key={category}>
                                <h2>{category}</h2>
                                <ResourceCarousel resources={resources} />
                            </div>
                        ))}
                    </div>

                    <h1>Additional Dearborn-Based Resources</h1>
                    <div>
                        {Object.entries(groupedResources).map(([category, resources]) => (
                            <div key={category}>
                                <h2>{category}</h2>
                                <ResourceCarousel resources={resources} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;