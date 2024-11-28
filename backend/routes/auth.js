// Include routes for registration and login 
// Integrate in server.js

const express = require('express');
const User = require('../models/user.js')

const router = express.Router()

router.post('/register', async (req, res) => {
    try{
    const {username, email, password} = req.body;
    const user = new User({username, email, password});
    await user.save();
    res.status(201).json({message: 'User registered successfully!'})
    } catch(err) {
        console.error('Error during registration:', err);
    }
});

router.post('/login', async (req, res) => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({error: "User does not exist"})
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect){
            return res.status(401).json({ message: 'Password does not match'})  
        }
        res.status(200).json({message : 'User logged in successfully!'})
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

const isAdmin = (req, res, next) => {
    const userRole = req.body.role;
    if (userRole !== "admin"){
        return res.status(403).json({message: 'Access denied.'})
    }
    next();
}

module.exports = router;