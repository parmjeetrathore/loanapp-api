
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'supremecars',
    api_key: '373825215445182',
    api_secret: '7UO0UExSavq1yp9Y92p-HOlK4mQ'
});

module.exports = cloudinary;
