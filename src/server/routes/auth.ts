import express from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpException } from '../errors';
import db from '../models';
import { hashPassword, verifyPassword } from '../utils/passwords';

const authRouter = express.Router();

authRouter.post('/signin', async function (req, res, next) {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(
			new HttpException(
				401,
				'Cannot sign in without an email or password.',
			),
		);
	}

	const existingUser = await db.user.findOne({ email });
	if (!existingUser) {
		return next(
			new HttpException(401, 'No account exists for the given email.'),
		);
	}

	const doesPasswordMatch = await verifyPassword(
		password,
		existingUser.passwordHash,
	);

	if (!doesPasswordMatch) {
		return next(new HttpException(401, 'Incorrect password.'));
	}

	const { JWT_SECRET: jwtSecret } = process.env;
	if (!jwtSecret) {
		return next(
			new HttpException(500, 'Server is incorrectly configured.'),
		);
	}

	// Create a new token with the email in the payload
	// and which expires 300 seconds after issue
	const token = jwt.sign({ id: existingUser._id }, jwtSecret, {
		expiresIn: '1d',
	});
	console.log('token:', token);

	res.status(200)
		.cookie('token', token, {
			secure: true,
			sameSite: 'strict',
			httpOnly: true,
		})
		.send({
			userId: existingUser._id,
		});
});

authRouter.post('/signup', async function (req, res, next) {
	const { email, password } = req.body;
	if (
		!email ||
		!password ||
		typeof password !== 'string' ||
		typeof email !== 'string'
	) {
		return next(
			new HttpException(
				401,
				'Cannot sign up without an email or password.',
			),
		);
	}

	const existingUser = await db.user.findOne({ email });
	if (existingUser) {
		return next(
			new HttpException(
				401,
				'An account already exists for the given email. Did you mean to log in?',
			),
		);
	}

	const { JWT_SECRET: jwtSecret } = process.env;
	if (!jwtSecret) {
		return next(
			new HttpException(500, 'Server is incorrectly configured.'),
		);
	}

	if (password.length < 15) {
		return next(
			new HttpException(
				401,
				'Your password must be at least 15 characters long.',
			),
		);
	}

	let newUserId;
	try {
		const passwordHash = await hashPassword(password);
		const newUser = new db.user({
			email,
			passwordHash,
		});
		const { _id } = await newUser.save();
		newUserId = _id as string;
	} catch (err) {
		return next(new HttpException(401, 'Unknown error creating account.'));
	}

	// create a token
	const accessToken = jwt.sign({ id: newUserId }, jwtSecret, {
		expiresIn: '1d',
	});

	res.status(200)
		.cookie('token', accessToken, {
			secure: true,
			sameSite: 'strict',
			httpOnly: true,
		})
		.send({
			userId: newUserId,
			accessToken,
		});
});

export default authRouter;
