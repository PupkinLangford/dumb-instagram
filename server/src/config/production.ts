import {v2} from 'cloudinary';
v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const config = {
  serverPort: process.env.PORT || '8080',
  serverDatabase: process.env.DB_URI_PROD,
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
