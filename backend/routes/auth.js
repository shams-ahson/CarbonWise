// Include routes for registration and login 
// Integrate in server.js

const express = require('express');
const User = require('../models/user.js')
const jwt = require('jsonwebtoken');

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
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({error: "User does not exist"})
        }
        console.log('User found:', user);
        const isPasswordCorrect = await user.comparePassword(password);
        console.log('Password correct:', isPasswordCorrect);
        if (!isPasswordCorrect){
            return res.status(401).json({ message: 'Password does not match'})  
        }

        const sessionToken = jwt.sign({user_id: user._id}, JWT_SECRET, {expiresIn: '1h'});
        user.session_id = sessionToken;
        console.log('Updated session_id:', user.session_id); 
        await user.save();

        res.status(200).json({message : 'User logged in successfully!', session_id: sessionToken,})
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({error: err.message});
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
    if(!token) {
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