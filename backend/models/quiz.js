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
            required: true
            },
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
    
});

const Quiz = mongoose.model('Quiz', quizSchema)
module.exports = Quiz;