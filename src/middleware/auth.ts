import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { HttpException } from '../errors';

const { JWT_SECRET: jwtSecret } = process.env;

export default function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	if (!jwtSecret) {
		return next(
			new HttpException(500, 'Server is incorrectly configured.'),
		);
	}

	const token = req.headers['x-access-token'] as string;
	if (!token) {
		return next(new HttpException(401, 'No token.'));
	}

	try {
		const { id: userId } = <{ id: string }>jwt.verify(token, jwtSecret);
		if (!userId) {
			return next(new HttpException(401, 'Poorly formatted token.'));
		}
		req.userId = userId;
		return next();
	} catch (error) {
		return next(new HttpException(401, 'Could not verify token.'));
	}
}
