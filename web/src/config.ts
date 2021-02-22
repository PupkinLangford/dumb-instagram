type Config = {
  serverUrl: string;
};

const dev: string = 'http://localhost:5000/graphql';
const prod: string = '';

const config: Config = {
  serverUrl: process.env.NODE_ENV === 'development' ? dev : prod,
};

export default config;
