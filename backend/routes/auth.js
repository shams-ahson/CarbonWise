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
        const sessionToken = jwt.sign({ user_id: user._id }, JWT_SECRET, { expiresIn: '12h' });
        user.session_id = sessionToken;
        await user.save();
        console.log("Generated Token:", sessionToken);
        console.log("Saved session_id in DB:", user.session_id);


        // Check quiz completion status
        const quiz = await Quiz.findOne({ user_id: user._id });
        const quizCompleted = quiz ? quiz.quiz_completed : false;
        const score = quizCompleted ? quiz.score : null;

        // Respond with session token and quiz status
        res.status(200).json({
            message: 'User logged in successfully!',
            session_id: sessionToken,
            quiz_completed: quizCompleted,
            total_emissions: score,
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


const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin"){
        return res.status(403).json({message: 'Access denied. Admins only.'})
    }
    next();
}

// Assign specific accounts admin perms
router.put('/makeAdmin/:userId', authenticate, async(req, res) => {
    try{
        const {userId} = req.params;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        user.role = 'admin';
        await user.save();
        console.log("Updated User Role:", user.role);

        res.status(200).json({message: 'User is an admin now!'})
    } catch (error){
        console.error('Error promoting user to admin:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.get('/me', authenticate, async (req,res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } catch (error){
        console.error('Error fetching user data:', error);
        res.status(500).json({error: 'Server error'});
    }
});

router.get('/adminPage', authenticate, isAdmin, async (req, res) => {
    res.status(200).json({message: 'This is the admin page.'})
})

module.exports = {router, authenticate, isAdmin};