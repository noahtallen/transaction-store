// External dependencies:
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import cookieParser from 'cookie-parser';

// Load config values.
import * as dotenv from 'dotenv';
dotenv.config();

// Internal dependencies:
import { setupDatabase } from './utils/database';
import errorMiddleware from './middleware/errors';
import authRouter from './routes/auth';

const port = process.env.PORT;
if (!port) {
	throw new Error('Please specify a port to run the server on.');
}

const server = express();

// 1. Setup database:
setupDatabase();

// 2. Setup express middleware:
server.use(
	cors({
		origin: `http://localhost:${port}`,
	}),
);

server.use(bodyParser.json());

server.use(bodyParser.urlencoded({ extended: true }));

server.use(cookieParser());

// 3. Setup express routes:
server.get('/', (req, res) => {
	res.sendFile(path.resolve('./src/app/logged-out.html'));
});

server.listen(port, () => {
	console.log(`server is running on port ${port}`);
});

server.use('/auth', authRouter);

// 4. Setup error middleware. Must be last.
server.use(errorMiddleware);
