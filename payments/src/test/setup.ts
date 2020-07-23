import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[]; // A promise that will resolve with a string array
    }
  }
}

jest.mock('../nats-wrapper'); // fake nats-wrapper
process.env.STRIPE_KEY =
  'sk_test_51H7P32CtbDYRlkjO4WLK7PEQMSn8ILGLpuC4C7JF6OFNFDf9oxQzsVUgkpPLp76L3CQZv1CHU1SM5MsBjFyixBve00oSIU9VyD';

let mongo: any;

//hook function, whatever we run here, runs before all tests are executed
beforeAll(async () => {
  // setup jwt environment variable
  process.env.JWT_KEY = 'asdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// this is a function that will happen before each of our tests
beforeEach(async () => {
  // clear mocks data
  jest.clearAllMocks();
  // delete each test, reach into mongodb and reset the db
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// After tests are done, disconnect from mongodb/memory-server
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// global helper function for user signup, ****(help getting cookies)***
global.signin = (id?: string) => {
  // Build a JWT payload. { id, email }
  // if we privided a id use it, if not generate a new one
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
