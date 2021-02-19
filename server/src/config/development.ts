import {v2} from 'cloudinary';
require('dotenv').config();

v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const config = {
  serverUrl: process.env.SERVER_URL,
  serverPort: process.env.SERVER_PORT,
  serverDatabase: process.env.DB_URI_DEV,
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
