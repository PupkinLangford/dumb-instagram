type Config = {
  serverUrl: string;
  cloudinaryBaseUrl: string;
};

const dev: string = 'http://localhost:5000/graphql';
const prod: string = '';

const config: Config = {
  serverUrl: process.env.NODE_ENV === 'development' ? dev : prod,
  cloudinaryBaseUrl: 'https://res.cloudinary.com/daqi29wve/image/upload/',
};

export default config;
