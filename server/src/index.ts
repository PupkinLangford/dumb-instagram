import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.listen(process.env.SERVER_PORT, () => {
  console.log(`now listening for requests on port ${process.env.SERVER_PORT}`);
});

export default app;
