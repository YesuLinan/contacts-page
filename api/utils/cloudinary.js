// utils/cloudinary.js
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'do1pv1lhq',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = cloudinary;