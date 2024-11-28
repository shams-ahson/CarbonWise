// User database
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: [true, 'Username is required.'], 
        unique: true
    },

    email: {
        type: String, 
        required: [true, 'Email is required.'],
        unique: true
    },

    password: {
        type: String, 
        required: [true, 'Password is required.'], 
        minlength: [8, 'Password must be at least 8 characters long.']
        },
    
    /*role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }*/
});

// Ensures password is hashed before saving
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compares the password to the one in the database
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);   
}

const User = mongoose.model('User', userSchema)
module.exports = User;