import * as express from 'express'; // eslint-disable-line @typescript-eslint/no-unused-vars

declare global {
	namespace Express {
		interface Request {
			userId: string;
		}
	}
}
