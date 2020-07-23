import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler, currentUser } from '@botickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); // trust traffic from proxy, trust connection even though traffic is coming from proxy (nginx)
app.use(json());
app.use(
  cookieSession({
    signed: false, // for not encrpting the cookie
    secure: process.env.NODE_ENV !== 'test', // https connection must be used from user
  })
);
app.use(currentUser);

app.use(createChargeRouter);

// when a route is not found, mitigate chances of using app, in unintended ways
app.all('*', async (req, res) => {
  throw new NotFoundError(); // dont need next function because of express-async-errors
});

app.use(errorHandler);

app.get('/api/users/currentuser', (req, res) => {
  res.send('Hi There!');
});

export { app };
