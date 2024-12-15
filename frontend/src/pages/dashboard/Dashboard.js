import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/Button';
import footprints from './footprints.png';
import ResourceCarousel from '../../components/Carousel';
import ResourceCard from '../../components/Card';
import hinespark from './hinespark.jpg';
import "./Dashboard.css";

const aiResponse = `Based on your responses, here are some suggestions:
Lapeer Park (Bike/Walk Trail): Explore Lapeer Park to reduce vehicle usage...
Ford Field Park (Bike/Walk Trail): Explore Ford Field Park to reduce vehicle usage...
UM-Dearborn Shuttle (Public Transportation): Reduce your carbon footprint...
SMART Bus (Public Transportation): Reduce your carbon footprint...
SMART offers the FAST (Frequent Affordable Safe Transit): FAST bus lines...
Westborn Market (Grocery Store): Visit Westborn Market for fresh produce...`;

const parseAIrecommendations = (aiResponse) => {
    const resourceRegex = /([a-zA-Z0-9\s'-]+)\s\((Bike\/Walk Trail|Public Transportation|Clothes Market|Grocery Store)\)/g;
    const rec_resources = []
    let match;
    while((match = resourceRegex.exec(aiResponse)) !== null) {
        //rec_resources.push(match[1]);
        //console.log(`MATCH: ${match}`);
        const resourceName = match[1].trim();
        const resourceCategory = match[2].trim();
        rec_resources.push({ name: resourceName, category: resourceCategory });
        //console.log(`RESOURCE NAME: ${rec_resources}`);
    }
    //console.log(`RECOMMENDED RESOURCES: ${rec_resources}`);
    return rec_resources
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
        const storedScore = localStorage.getItem('totalEmissions');
        return storedScore ? parseFloat(storedScore) : initialEmissions || null;
    });

    const [quizCompleted, setQuizCompleted] = useState(() => {
        const storedQuizStatus = localStorage.getItem('quizCompleted');
        return storedQuizStatus === 'true'; 
    });

    const [groupedResources, setGroupedResources] = useState({});
    const [loadingScore, setLoadingScore] = useState(!totalEmissions); 
    const [loadingResources, setLoadingResources] = useState(true);

    const averageUSEmissions = 16;
    const averageGlobalEmissions = 4;

    const userEmissionsArray = totalEmissions ? Array(Math.round(totalEmissions)).fill(null) : [];
    const averageUSEmissionsArray = Array(averageUSEmissions).fill(null);
    const averageGlobalEmissionsArray = Array(averageGlobalEmissions).fill(null);
   //const [matched, setMatchedResources] = useState([]);
    const [groupedResources, setGroupedResources] = useState({});
    const [aiResources, setAIResources] = useState({
        'Bike/Walk Trail': [],
        'Public Transportation': [],
        'Clothes Market': [],
        'Grocery Store': []
    });
    const [loadingScore, setLoadingScore] = useState(true);
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

            
            const aiResults = parseAIrecommendations(aiResponse);
            console.log(`AI RESULTS FROM PARSE: ${aiResults}`);
            const aiGrouped = groupResourcesByCategory(aiResults);
            setAIResources(aiGrouped);
        // localStorage.setItem('aiResources', JSON.stringify(aiGrouped));
            console.log("AI RESOURCES:", aiResources);
 
            //console.log("AI RESULTS FROM PARSE:", JSON.stringify(yourArray, null, 2));

            // Fetch Score
            if (!initialEmissions) {
                try {
                    const response = await axios.get('http://localhost:5001/api/quiz/score', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const fetchedScore = response.data.score || 0;
                    setTotalEmissions(fetchedScore);
                    localStorage.setItem('totalEmissions', fetchedScore);
                } catch (error) {
                    console.error('Error fetching quiz score:', error);
                    setTotalEmissions(0);
                } finally {
                    setLoadingScore(false);
                }
            } else {
                setLoadingScore(false);
            }
    
            try {
                const response = await axios.get('http://localhost:5001/api/resources');
                const grouped = groupResourcesByCategory(response.data);
                setGroupedResources(grouped);

                const resourceNames = Object.values(aiGrouped)
                    .flat()
                    .map((resource) => resource.name) 
                    .join(','); 
                
                    const specificResourceResponse = await axios.get('http://localhost:5001/api/resource-details', {
                        params: { names: resourceNames },
                    });

                    const matchedResources = {};
                    Object.entries(aiGrouped).forEach(([category, resources]) => {
                        matchedResources[category] = resources.map((resource) => {
                            let match = specificResourceResponse.data.find(r => r.name === resource.name);
                            if (!match) {
                                match = response.data.find(r => r.name === resource.name);
                            }
                            return match;
                        }).filter(Boolean);
                    });
                setMatchedResources(matchedResources);
                localStorage.setItem('matchedResources', JSON.stringify(matchedResources));
                //console.log("GROUPED AI:", JSON.stringify(aiGrouped, null, 2));
                //console.log(`ALL RESOURCES: ${response.data.name}`);
                // const matchedResources = {};
                // Object.entries(aiResources).forEach(([category, resources]) => {
                //     matchedResources[category] = resources.map((resource) => {
                //         const matchedResource = response.data.find(
                //             (r) => r.name === resource.name
                //         );
                //        // console.log("MATCHED RESOURCES:", matchedResource); 
                //         //console.log("RESOURCE:", resource);
                //         return matchedResource;                       
                //     });     
                //     //console.log("HELP MATCHED RESOURCES:", matchedResources);
                //     //setMatchedResources(matchedResources);
                // });
                // setMatchedResources(matchedResources);
                // localStorage.setItem('matchedResources', JSON.stringify(matchedResources));
                // //const savedResources = localStorage.getItem('matchedResources');
                // //setMatchedResources(JSON.parse(savedResources));
                // console.log("FINAL! MATCHED RESOURCES:", matched);
    
                
            } catch (error) {
                console.error('Error fetching resources:', error);
                const savedResources = localStorage.getItem('matchedResources');
                if (savedResources) {
                    try {
                        const parsedResources = JSON.parse(savedResources);
                        setMatchedResources(parsedResources);
                    } catch (parseError) {
                        console.error('Error parsing saved resources:', parseError);
                    }
                }
            } finally {
                setLoadingResources(false);
            }
        };
        //await
        // const fetchSpecificResources = async () => {
        //     console.log("DOUBLE CHECK", aiResources);
        //     const resourceNames = Object.values(aiResources).flat().map((resource) => resource.name).join(',');
        //     //const resourceNames = aiResources[category].map(resource => resource.name);            
        //     console.log("!!!!RESOURCE NAMES:", resourceNames);
        //     try {
        //         const response = await axios.get('http://localhost:5001/api/resource-details', 
        //             {params: { names: resourceNames }});
        //         console.log("SPECIFIC RESOURCES:", response.data);
        //         setMatchedResources(response.data);
        //     } catch (error) {
        //         console.error('Error fetching specific resources:', error);
        //     }
        // };
        
        fetchScoreAndResources();
        //fetchSpecificResources();
        //fetchData();
        console.log("MATCHED AGAIN:", matched);
        //console.log("MATCHED FINAL:", matched);
       // console.log("MATCHED FINAL:", JSON.stringify(matched, null, 2));
    }, [initialEmissions]);
    //console.log("MATCHED FINAL:", JSON.stringify(matched, null, 2));

    if (loadingScore || loadingResources) return <div>Loading...</div>;

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
                    
                    {/* will be automatically populated based on what chatgpt provides */}
                    {/* <h2>Natural Trails</h2>
                    <ResourceCard
                        image_url={hinespark}
                        name="Hines Park"
                        description="The Hines Park Trail includes a 20-mile connection from Michigan Ave. (Dearborn) to Northville, featuring paved paths, parks, dog areas, and picnic facilities. The trail runs parallel to Edward Hines Drive and passes through scenic areas"
                        address="123 Street, Dearborn, MI"
                    />
                     */}
                    <div>
                        {Object.entries(matched).map(([category, resources]) => (
                            <div key={category}>
                                <h2>{category}</h2>
                                <ResourceCarousel resources={resources} />
                            </div>
                        ))}
                    </div>
{/* 
                    <h2>Sustainable Markets</h2>
                    <ResourceCard
                        image_url={hinespark}
                        name="Hines Park"
                        description="The Hines Park Trail includes a 20-mile connection from Michigan Ave. (Dearborn) to Northville, featuring paved paths, parks, dog areas, and picnic facilities. The trail runs parallel to Edward Hines Drive and passes through scenic areas"
                        address="123 Street, Dearborn, MI"
                    /> */}

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