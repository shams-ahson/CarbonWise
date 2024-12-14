// Include routes for registration and login 
// Integrate in server.js

const express = require('express');
const User = require('../models/user.js')
const jwt = require('jsonwebtoken');
const Quiz = require('../models/quiz');

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

router.post('/register', async (req, res) => {
    try{
    const {username, email, password} = req.body;

    const user = new User({username, email, password});
    
    await user.save();
    console.log('User saved:', user); 
    res.status(201).json({message: 'User registered successfully!'})
    } catch(err) {
        console.error('Error during registration:', err);
        res.status(500).json({error: 'An unexpected error occurred.'})
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }

        // Validate password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Password does not match' });
        }

        // Generate session token
        const sessionToken = jwt.sign({ user_id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        user.session_id = sessionToken;
        await user.save();

        // Check quiz completion status
        const quiz = await Quiz.findOne({ user_id: user._id });
        const quizCompleted = quiz ? quiz.quiz_completed : false;

        // Respond with session token and quiz status
        res.status(200).json({
            message: 'User logged in successfully!',
            session_id: sessionToken,
            quiz_completed: quizCompleted,
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: err.message });
    }
});


router.post('/logout', async(req, res) => {
    try {
        const {session_id} = req.body;
        const user = await User.findOne({session_id});
        if(!user) {
            return res.status(404).json({error: 'Invalid session or user not found.'});
        }
    
        await user.clearSession();
        res.status(200).json({message: 'User logged out successfully!'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Token received in authenticate middleware:", token);

    if(!token) {
        console.error("No token provided");
        return res.status(401).json({message: 'No token provided.'});
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.user_id);
        if (!user || user.session_id !== token) {
            return res.status(401).json({message: 'Invalid session.'});
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(401).json({message: 'Invalid token.'});
    }
};

/*
const isAdmin = (req, res, next) => {
    const userRole = req.body.role;
    if (userRole !== "admin"){
        return res.status(403).json({message: 'Access denied.'})
    }
    next();
}*/

module.exports = {router, authenticate};