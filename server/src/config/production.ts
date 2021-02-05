const config = {
  serverUrl: process.env.SERVER_URL,
  serverPort: process.env.PORT,
  serverDatabase: process.env.DB_URI_PROD,
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
