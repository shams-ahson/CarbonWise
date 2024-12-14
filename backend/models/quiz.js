const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    responses: [
        {
            question_id: {
            type: String,
            required: true
            },

            selected_option: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
            },

            _id: false
        }, 
    ],

    timestamp: {
        type: Date,
        default: Date.now
    },

    quiz_completed: {
        type: Boolean,
        default: false
    },

    score: {
        type: Number,
        required: true
    },
    
});

const Quiz = mongoose.model('Quiz', quizSchema)
module.exports = Quiz;