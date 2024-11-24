const Profile = require('../models/Profile');

const profileController = {
  // Get complete profile
  getProfile: async (req, res) => {
    try {
      const profile = await Profile.findOne({ userId: req.params.userId });
      
      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      
      res.json(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update personal information
  updatePersonalInfo: async (req, res) => {
    try {
      const updatedProfile = await Profile.findOneAndUpdate(
        { userId: req.params.userId },
        { 
          $set: { 
            personalInfo: req.body,
            lastUpdated: new Date()
          }
        },
        { new: true, upsert: true, runValidators: true }
      );
      res.json(updatedProfile);
    } catch (error) {
      console.error('Error updating personal info:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update measurements
 updateMeasurements : async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(req.body)
    const { height, shoulder, waist, hip, shape } = req.body;

    // Find the profile by userId and update the measurements field
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: userId },
      { 
        $set: { 
          "measurements.height": height,
          "measurements.shoulderWidth": shoulder,
          "measurements.waistWidth": waist,
          "measurements.hipWidth": hip,
          "measurements.bodyType": shape,
          lastUpdated: new Date() 
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating measurements:', error);
    res.status(500).json({ message: 'Server error' });
  }
},


  // Update preferences
  updatePreferences: async (req, res) => {
    try {
      const updatedProfile = await Profile.findOneAndUpdate(
        { userId: req.params.userId },
        { 
          $set: { 
            preferences: req.body,
            lastUpdated: new Date()
          }
        },
        { new: true, upsert: true, runValidators: true }
      );
      res.json(updatedProfile);
    } catch (error) {
      console.error('Error updating preferences:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update general profile
  updateGeneralProfile: async (req, res) => {
    try {
      const updatedProfile = await Profile.findOneAndUpdate(
        { userId: req.params.userId },
        { 
          $set: { 
            generalProfile: req.body,
            lastUpdated: new Date()
          }
        },
        { new: true, upsert: true, runValidators: true }
      );
      res.json(updatedProfile);
    } catch (error) {
      console.error('Error updating general profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete profile
  deleteProfile: async (req, res) => {
    try {
      const deletedProfile = await Profile.findOneAndDelete({ userId: req.params.userId });
      
      if (!deletedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
      console.error('Error deleting profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

getEyeColor : async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(req.body)
    const { eyeColor } = req.body;
    // Find the profile by userId and update the measurements field
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: userId },
      { 
        $set: { 
          "preferences.eyeColor": eyeColor,
          lastUpdated: new Date() 
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({message: "done"});
    
  } catch (error) {
    console.error('Error updating measurements:', error);
    res.status(500).json({ message: 'Server error' });
  }
},

updateHaircolor : async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(req.body)
    const { hairColor } = req.body;
    // Find the profile by userId and update the measurements field
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: userId },
      { 
        $set: { 
          "preferences.hairColor": hairColor,
          lastUpdated: new Date() 
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({message: "done"});
    
  } catch (error) {
    console.error('Error updating measurements:', error);
    res.status(500).json({ message: 'Server error' });
  }
},

updateSkinColor : async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(req.body)
    const { colorType } = req.body;
    // Find the profile by userId and update the measurements field
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: userId },
      { 
        $set: { 
          "preferences.skinTone": colorType,
          lastUpdated: new Date() 
        }
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({message: "done"});
    
  } catch (error) {
    console.error('Error updating measurements:', error);
    res.status(500).json({ message: 'Server error' });
  }
},

};

module.exports = profileController;
