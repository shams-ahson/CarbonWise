import React, { useState } from 'react';
import "./Calculator.css";
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import TextInput from '../../components/Forms/TextInput';
import Counter from '../../components/Forms/Counter';
import Radio from '../../components/Forms/Radio';
import Dropdown from '../../components/Forms/Dropdown';
import Checkbox from '../../components/Forms/Checkbox';

const Calculator = () => {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAnswers((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(answers);
    };

    const sections= [
        {
            header: "General",
            questions: [
                { id: 'address1', label: 'Address Line 1', type: 'text'},
                { id: 'address2', label: 'Address Line 2', type: 'text'},
                { id: 'city', label: 'City', type: 'text' },
                { id: 'state', label: 'State', type: 'text' },
                { id: 'zipcode', label: 'Zip Code', type: 'text' },
            ],
        },
        {
            header: "Household",
            questions: [
                { id: 'householdSize', label: 'How many people live in your household?', type: 'counter' },
                { id: 'electricity', label: 'How much electricity do you consume per month? (kWh)', type: 'counter' },
                { id: 'naturalGas', label: 'How much natural gas do you consume per month? (Therms)', type: 'counter' },
                { id: 'fuelOil', label: 'How much fuel oil do you consume per month? (Gallons)', type: 'counter' },
                { id: 'Propane', label: 'How much propane do you consume per month? (Gallons)', type: 'counter' },
                { id: 'water', label: 'How much water do you consume monthly?', type: 'counter' },
                { id: 'trash', label: 'How many bags of trash does your household produce weekly?', type: 'counter' },
                { id: 'recycle', label: 'Select any of the following items that you recycle.', type: 'checkbox', options: ['Plastic', 'Paper', 'Glass', 'Metal'] },
            ],
        },
        {
            header: "Transportation",
            questions: [
                { id: 'vehicles', label: 'How many vehicles are in your house?', type: 'counter' },
                { id: 'publicTransport', label: 'How often do you use public transport?', type: 'dropdown', options: ['Daily', 'Weekly', 'Rarely', 'Never'] },
                { id: 'travelDistance', label: 'How far do you travel via public transportation weekly? (Miles)', type: 'counter' },
                { id: 'shortFlights', label: 'How many short flights (less than 3 hours) do you take annually?', type: 'counter' },
                { id: 'longFlights', label: 'How many long flights (more than 3 hours) do you take annually?', type: 'counter' },
            ],
        },
        {
            header: "Food and Diet",
            questions: [
                { id: 'diet', label: 'What is your primary diet?' , type: 'dropdown', options: ['Vegan', 'Vegetarian', 'Pescatarian', 'Omnivore', 'High Meat']},
                { id: 'groceries', label: 'Select the location where you buy your groceries.', type: 'checkbox', options: ['Retail Stores', 'Supermarkets', 'Local Farmer\'s Markets', 'Organic Stores', 'Convenience Stores', 'Warehouse Clubs'] },
                { id: 'eatOut', label: 'How many times do you eat out per week?', type: 'counter' },
            ],
        },
        {
            header: "Lifestyle",
            questions: [
                { id: 'clothes', label: 'How often do you purchase new clothes?', type: 'dropdown', options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Rarely', 'Never'] },
                { id: 'electronics', label: 'How often do you purchase new electronics?', type:'dropdown', options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Rarely', 'Never'] },
                { id: 'homeGoods', label: 'How often do you purchase new home goods?', type: 'dropdown', options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Rarely', 'Never'] },
                { id: 'secondHand', label: 'How often do you buy secondhand items?', type: 'dropdown', options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Rarely', 'Never'] },
                { id: 'carbonOffset', label: 'Do you participate in any carbon offset programs?', type: 'radio', options: ['Yes', 'No', 'Sometimes'] },
                { id: 'renewableEnergy', label: 'Do you use renewable energy sources in your daily life?', type: 'radio', options: ['Yes', 'No', 'Sometimes'] },
            ]
        }
    ]

    return (
        <div className='centered-container'>
            <h1>Carbon Footprint Calculator</h1>
            <div className='calculator-container'>

                <div className='description-container'>
                    <p>Start reducing your carbon footprint by understanding your overall carbon footprint score.</p>
                    <p>Answer a few quick questions about your daily habits, and the calculator will provide resources and recommendations based on your score!</p>
                </div>

            <form className="form-group" onSubmit={handleSubmit}>
                {sections.map((section) => (
                <div className="section" key={section.header}>
                <h2>{section.header}</h2>
                {section.questions.map((q) => {
                    return (
                    <div className="question-wrapper" key={q.id}>
                        {(() => {
                        switch (q.type) {
                            case 'text':
                            return (
                                <TextInput
                                label={q.label}
                                name={q.id}
                                value={answers[q.id] || ''}
                                onChange={handleChange}
                                />
                            );
                            case 'counter':
                            return (
                                <Counter
                                label={q.label}
                                name={q.id}
                                value={answers[q.id] || 0}
                                onChange={handleChange}
                                />
                            );
                            case 'radio':
                            return (
                                <Radio
                                label={q.label}
                                name={q.id}
                                value={answers[q.id] || ''}
                                options={q.options}
                                onChange={handleChange}
                                />
                            );
                            case 'dropdown':
                            return (
                                <Dropdown
                                label={q.label}
                                name={q.id}
                                value={answers[q.id] || ''}
                                options={q.options}
                                onChange={handleChange}
                                />
                            );
                            case 'checkbox':
                            return (
                                <Checkbox
                                label={q.label}
                                name={q.id}
                                values={answers[q.id] || []}
                                options={q.options}
                                onChange={handleChange}
                                />
                            );
                            default:
                            return null;
                        }
                        })()}
                    </div>
                    );
                })}
                </div>
                ))}

                <Button
                    label="Submit"
                    onClick={() => navigate('/recommendations')}
                    variant="primary"
                    style={{ fontSize: '20px', width: '200px', fontWeight: '200' }}
                />
            </form>

            </div>
        </div>
    );
};

export default Calculator;