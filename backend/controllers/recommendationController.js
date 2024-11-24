const { exec } = require('child_process');
const Profile = require('../models/Profile');

const recommendationController = {
    getRecommendations: async (req, res) => {
        try {
            const { userId, articleType } = req.body;

            // Fetch user details from MongoDB
            const userProfile = await Profile.findOne({  userId: req.params.userId });
            if (!userProfile) {
                return res.status(404).json({ message: 'User profile not found' });
            }

            // Extract required fields
            const { bodyType, hairColor, skinTone, eyeColor } = userProfile.measurements;
            const { gender } = userProfile.personalInfo;

            // Map article type to clothing type
            const clothingTypeMapping = {
                'Tshirts': 'topwear',
                'Shirts': 'topwear',
                'Jackets': 'topwear',
                'Sweatshirts': 'topwear',
                'Dresses': 'topwear',
                'Jeans': 'bottomwear',
                'Shorts': 'bottomwear',
                'Trousers': 'bottomwear',
                'Skirts': 'bottomwear',
                'Tracksuits': 'bottomwear',
                'Casual Shoes': 'footwear',
                'Formal Shoes': 'footwear',
                'Sandals': 'footwear',
                'Sports Shoes': 'footwear',
                'Heels': 'footwear'
            };
            const clothingType = clothingTypeMapping[articleType] || 'unknown';

            if (clothingType === 'unknown') {
                return res.status(400).json({ message: 'Invalid article type' });
            }

            // Prepare the Python command
            const pythonScript = `python ../recommendation/recommend.py "${bodyType}" "${hairColor}" "${skinTone}" "${eyeColor}" "${gender}" "${articleType}" "${clothingType}"`;

            // Execute the Python script
            exec(pythonScript, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error executing Python script:', stderr);
                    return res.status(500).json({ message: 'Python script error', error: stderr });
                }

                // Parse the output and send it to the frontend
                const recommendations = JSON.parse(stdout);
                res.json({ recommendations });
            });
        } catch (error) {
            console.error('Error in recommendation controller:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = recommendationController;
