const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dmxscqnbe',
  api_key: process.env.CLOUDINARY_API_KEY || '311378781138923',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'PEzV1kaG-upTGnNV0H-c8mnThMc',
});

module.exports = cloudinary;
