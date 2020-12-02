import mongoose from 'mongoose';

export async function setupDatabase(): Promise<void> {
	const { DB_HOST: dbHost, DB_PORT: dbPort, DB_NAME: dbName } = process.env;
	try {
		await mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Sucessfully connected to the database.');
	} catch (err) {
		console.error('Could not connect to the database', err);
	}
}
