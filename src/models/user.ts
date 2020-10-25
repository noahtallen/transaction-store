import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
	email: string;
	passwordHash: string;
}

const userSchema = new mongoose.Schema<IUser>(
	{
		email: {
			type: String,
			lowercase: true,
			required: [true, 'must exist'],
			match: [/\S+@\S+\.\S+/, 'is invalid'],
			index: {
				unique: true,
			},
			unique: true,
		},
		passwordHash: {
			type: String,
			required: [true, 'must exist'],
		},
	},
	{ timestamps: true },
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
