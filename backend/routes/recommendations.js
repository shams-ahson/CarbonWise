const express = require('express');
const {generateRecommendations} = require('../ai');
const QuizResponses = require('../models/quiz');
const Resource = require('../models/resources');
const router = express.Router();

const relevantQuestions = ['trash', 'vehicles', 'publicTransport', 'groceries', 'eatOut', 'clothes', 'electronics', 'homeGoods', 'gym' ];

router.post('/recommendations', async (req, res) => {
    try {
        const {user_id} = req.body;
        console.log('User ID:', user_id);
        const quiz = await QuizResponses.find({
            responses: {
                $elemMatch: {
                    question_id : {$in: relevantQuestions}
                }
            },
            user_id: user_id,
        });
      
        let promptText = 'Based on the following quiz responses, provide personalized suggestestions for reducing carbon footprint: \n';
        quiz.forEach((question) => {
            question.responses.forEach((response) => {
                if (relevantQuestions.includes(response.question_id)) {
                    switch (response.question_id) {
                        case 'trash':
                            promptText += `I produce ${response.selected_option} trashbag(s) a week.`;
                            break;
                        case 'vehicles':
                            promptText += `I own ${response.selected_option} vehicles.`;
                            break;
                        case 'publicTransport':
                            promptText += `I use public transportation ${response.selected_option}.`;
                            break;
                        case 'groceries':
                            promptText += `I shop at ${response.selected_option}.`;
                            break;
                        case 'eatOut':
                            promptText += `I eat out ${response.selected_option} times a week.`;
                            break;
                        case 'clothes':
                            promptText += `I purchase new clothes ${response.selected_option}.`;
                            break;
                        case 'electronics':
                            promptText += `I purchase new electronics ${response.selected_option}.`;
                            break;
                        case 'homeGoods':
                            promptText += `I purchase new home goods ${response.selected_option}.`;
                            break;
                        case 'gym':
                            promptText += `I go to the gym ${response.selected_option} times a week.`;
                            break;
                        default:
                            break;
                    }
                }
            });
        });

        console.log('Prompt:', promptText);
        const aiResponse = await generateRecommendations(promptText);
        console.log('AI Response:', aiResponse);
        res.status(200).json({message: 'Recommendations generated successfully!', aiResponse});
    } catch (err) {
        console.error('Error generating recommendations:', err.message);
        res.status(500).json({err: 'Failed to generate recommendations'});
    }
});

module.exports = router;