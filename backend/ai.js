const {OpenAI} = require('openai');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Set up OpenAI API
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const generateRecommendations = async (prompt) => {
    try {
    const completion = await openai.chat.completions.create({
        model: 'ft:gpt-4o-mini-2024-07-18:personal:carbonwise:AcMV4YIg',
        messages: [
            {
            role: 'system',
            content: 'You are a sustainability advisor from Dearborn, MI providing local resources to reduce carbon footprints based on user habits.',
            },
            {
            role: 'user',
            content: prompt,
            },
        ],
    });
    console.log('Completion:', completion.choices[0].message.content);
    return completion.choices[0].message.content;
    }
    catch (error) {
    console.error('Error interacting with OpenAI:', error);
    throw new Error('Failed to generate recommendation');
    }
};

module.exports = {
    generateRecommendations,
};
