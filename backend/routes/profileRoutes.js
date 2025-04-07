const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

//Get complete profile
router.get('/:userId/displayProfile', profileController.getProfile);
//updating profile
router.put('/:userId/updateProfile', profileController.updateProfile);
// route for outfit recommendations
router.post('/:userId/getData', profileController.getData); 
// Delete profile
router.delete('/:userId/deleteInfo', profileController.deleteProfile);

module.exports = router;