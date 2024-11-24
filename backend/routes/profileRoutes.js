const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
// Import the recommendation controller
const recommendationController = require('../controllers/recommendationController');


// Get complete profile
router.get('/api/profile/:userId', profileController.getProfile);

// Update routes for different sections
router.put('/:userId/personal-info', profileController.updatePersonalInfo);
router.put('/:userId/measurements', profileController.updateMeasurements);
router.put('/:userId/preferences', profileController.updatePreferences);
router.put('/:userId/general', profileController.updateGeneralProfile);
router.put('/:userId/eyecolor', profileController.getEyeColor);
router.put('/:userId/haircolor', profileController.updateHaircolor);
router.put('/:userId/skincolor', profileController.updateSkinColor);
// Add a route for outfit recommendations
 



// Delete profile
router.delete('/api/profile/:userId', profileController.deleteProfile);

module.exports = router;