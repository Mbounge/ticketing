import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>; // A promise that will resolve with a string array
    }
  }
}

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
global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
