const express = require('express');
const Quiz = require('../models/quiz');
const { authenticate } = require('./auth');
const router = express.Router();

// Save quiz responses
router.post('/quiz', authenticate, async (req, res) => {
    console.log("Authenticated user:", req.user);
    console.log("Request body:", req.body); 
    try {
        const { responses, quiz_completed, score } = req.body;

        const predefinedQuestions = [
            { id: 'address1', label: 'Address Line 1' },
            { id: 'address2', label: 'Address Line 2' }, // make it optional
            { id: 'city', label: 'City' },
            { id: 'state', label: 'State' },
            { id: 'zipcode', label: 'Zip Code' },
            { id: 'householdSize', label: 'How many people live in your household?' },
            { id: 'electricity', label: 'How much electricity does your household consume per month?' },
            { id: 'naturalGas', label: 'How much natural gas does your household consume per month?' },
            { id: 'fuelOil', label: 'How much fuel oil does your household consume per month?' },
            { id: 'Propane', label: 'How much propane does your household consume per month?' },
            { id: 'water', label: 'How much water does your household consume monthly?' },
            { id: 'trash', label: 'How many bags of trash does your household produce weekly?' },
            { id: 'recycle', label: 'Select any of the following items that you recycle.' },
            { id: 'vehicles', label: 'How many vehicles are in your house?' },
            { id: 'publicTransport', label: 'How often do you use public transport?' },
            { id: 'shortFlights', label: 'How many short flights (less than 3 hours) do you take annually?' },
            { id: 'longFlights', label: 'How many long flights (more than 3 hours) do you take annually?' },
            { id: 'diet', label: 'What is your primary diet?' },
            { id: 'groceries', label: 'Select the location where you buy your groceries.' },
            { id: 'eatOut', label: 'How many times do you eat out per week?' },
            { id: 'clothes', label: 'How often do you purchase new clothes?' },
            { id: 'electronics', label: 'How often do you purchase new electronics?' },
            { id: 'homeGoods', label: 'How often do you purchase new home goods?' },
            { id: 'gym', label: 'How often do you go to the gym per week?' },
            { id: 'carbonOffset', label: 'Do you participate in any carbon offset programs?' },
            { id: 'renewableEnergy', label: 'Do you use renewable energy sources in your daily life?' },
        ];

        const validatedResponses = predefinedQuestions.map((question) => {
            const userResponse = responses.find((r) => r.question_id === question.id);
            
            // Allow address2 to be optional
            if (question.id === 'address2' && (!userResponse || userResponse.selected_option === '')) {
                return {
                    question_id: question.id,
                    selected_option: null, 
                };
            }

            return {
                question_id: question.id,
                selected_option: userResponse ? userResponse.selected_option : null,
            };
        });     

        console.log("Validated Responses:", JSON.stringify(validatedResponses, null, 2));

        const existingQuiz = await Quiz.findOne({ user_id: req.user._id });
        if (existingQuiz && existingQuiz.quiz_completed) {
            return res.status(400).json({ message: 'You have already completed the quiz.' });
        }

        const quiz = new Quiz({
            user_id: req.user._id,
            responses: validatedResponses,
            quiz_completed,
            score
        });

        await quiz.save();

        res.status(201).json({ message: 'Quiz responses saved successfully!', quiz });
    } catch (err) {
        console.error('Error saving quiz responses', err.message);
        res.status(500).json({ error: 'Failed to save quiz responses' });
    }
});

// Check quiz completion status
router.get('/quiz/completed', authenticate, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ user_id: req.user._id });

        if (quiz && quiz.quiz_completed) {
            return res.status(200).json({ completed: true, quiz });
        }

        res.status(200).json({ completed: false });
    } catch (err) {
        console.error('Error checking quiz completion:', err);
        res.status(500).json({ error: 'Failed to check quiz completion.' });
    }
});

/*router.post('/quiz/retake', authenticate, async (req, res) => {
    try{
        await Quiz.deleteMany({user_id: req.user._id});

        res.status(200).json({ message: 'You can now retake the quiz.' });
    } catch (err) {
        console.error('Error allowing quiz retake');
        res.status(500).json({ error: 'Failed to allow quiz retake' });
    }
});*/

// Fetch quiz data for a user
router.get('/quiz/:userId', authenticate, async (req, res) => {
    try {
        const userQuizzes = await Quiz.find({ user_id: req.params.userId });

        if (!userQuizzes || userQuizzes.length === 0) {
            return res.status(404).json({ error: 'No quiz data found for this user.' });
        }

        res.status(200).json(userQuizzes);
    } catch (err) {
        console.error("Error fetching quiz data");
        res.status(500).json({ error: 'Failed to fetch quiz data.' });
    }
});

router.get('/quiz/score', authenticate, async (req,res) => {
    try {
        const quiz = await Quiz.findOne({user_id: req.user._id});

        if (!quiz || !quiz.quiz_completed) {
            return res.status(404).json({message: 'Quiz not completed yet.'})
        }

        res.status(200).json({score: quiz.score});
    } catch (err) {
        console.error('Error fetching quiz score:', err);
        res.status(500).json({error: 'Failed to fetch quiz score.'});
    }
});

module.exports = router;
