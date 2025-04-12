const Profile = require('../models/Profile');
const { exec } = require('child_process');

const profileController = {

  //get data from profile and send to recommendation model
  getData: async (req, res) => {
    try {
      const { userId } = req.params;
        const {articleType } = req.body;
        const mongoose = require('mongoose');
        const objectIdUser = new mongoose.Types.ObjectId(userId);
        //check if a profile exists
        const userProfile = await Profile.findOne({ userId: objectIdUser });

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        // Extract required fields
        const { bodyType, gender } = userProfile.measurements;
        const{ hairColor, skinTone, eyeColor}=userProfile.preferences;
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
        const pythonScript = `python recommendation/recommend.py "${bodyType}" "${hairColor}" "${skinTone}" "${eyeColor}" "${gender}" "${articleType}" "${clothingType}"`;

        // Execute the Python script
        exec(pythonScript, (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing Python script:', stderr);
                return res.status(500).json({ message: 'Python script error', error: stderr });
            }

            // Parse the output and send it to the frontend
            const recommendations = JSON.parse(stdout);
            res.json({recommendations});
        });
    } catch (error) {
        console.error('Error in recommendation controller:', error);
        res.status(500).json({ message: 'Server error' });
    }
  },

  // Get complete profile
  getProfile: async (req, res) => {
    try { 
      const mongoose = require('mongoose');
      // Ensure userId is treated as ObjectId
      const { userId } = req.params;
      const objectIdUser = new mongoose.Types.ObjectId(userId);

      //check if a profile exists
      const existingProfile = await Profile.findOne({ userId: objectIdUser });
      if (!existingProfile) {
          console.error("❌ No profile found for userId:", req.params);
          return res.status(404).json({ message: "Profile not found, cannot update Profile" });
      }

      res.json(existingProfile);

    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete profile
  deleteProfile: async (req, res) => {
    try {
      const mongoose = require('mongoose');
      // Ensure userId is treated as ObjectId
      const { userId } = req.params;
      const objectIdUser = new mongoose.Types.ObjectId(userId);

      //check if a profile exists
      const deletedProfile = await Profile.findOneAndDelete({ userId: objectIdUser });
      res.json({ message: 'Profile deleted successfully' });

    } catch (error) {
      console.error('Error deleting profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateProfile : async (req, res) => {
    try {
      const { userId } = req.params;
      const updatedData = req.body;
      const mongoose = require('mongoose');

      // Ensure userId is treated as ObjectId
      const objectIdUser = new mongoose.Types.ObjectId(userId);

      //check if a profile exists for this userId
      const existingProfile = await Profile.findOne({ userId: objectIdUser });

      if (!existingProfile) {
          console.error("❌ No profile found for userId:", userId);
          return res.status(404).json({ message: "Profile not found, cannot update Profile" });
      }

      // Update the profile 
      existingProfile.set(updatedData);
      existingProfile.lastUpdated = new Date();
      
      await existingProfile.save(); //Save the updated profile

      console.log("✅ Profile updated:", updatedData);
      res.json({ message: "Profile updated successfully!" });
      
    } catch (error) {
      console.error('Error updating Profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

};

module.exports = profileController;

