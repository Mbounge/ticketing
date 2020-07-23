import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@botickets/common';

import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check the db if user already exists
    const existingUser = await User.findOne({ email });
    // need to check if user is already in database
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });

    // save user to db
    await user.save();

    // Generate JWT

    const userJwt = jwt.sign(
      {
        // payload
        id: user.id,
        email: user.email,
      },
      // secret/private key, need to share this with other services
      process.env.JWT_KEY! // ! tells typescrpt that we know that this variable is 100% defined
    );

    // Store it on session object, We use req.session to store info into cookie (its automatically serialized)
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
