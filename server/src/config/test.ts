const config = {
  serverUrl: 'http://localhost',
  serverPort: 5001,
  serverDatabase: process.env.DB_URI_TEST,
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
