const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //Linking to user
    required: true,
    unique: true
  },
  profilePhoto: {
    url: { type: String },
    filename: { type: String },
    uploadDate: { type: Date }
  },
  personalInfo: {
    firstName: { type: String,  },
    lastName: { type: String,   },
    age: { type: Number },
    email: { type: String },
    phone: { type: String }
  },
  measurements: {
    height: { type: Number },
    gender: { type: String },
    shoulderWidth: { type: Number },
    waistWidth: { type: Number },
    hipWidth: { type: Number },
    bodyType: { type: String }
  },
  preferences: {
    hairColor: { type: String },
    eyeColor: { type: String },
    skinTone: { type: String },
    personalColorPreference: [{ type: String }],
    stylePreferences: [{ type: String }],
    fitPreferences: { type: String }
  },
  generalProfile: {
    occupation: { type: String },
    location: { type: String },
    stylePreferences: [{ type: String }],
    budget: { type: String },
    occasions: [{ type: String }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'Profile'
});

module.exports = mongoose.model('Profile', profileSchema);