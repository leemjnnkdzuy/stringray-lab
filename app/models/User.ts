import mongoose, {Schema, Document, Model} from "mongoose";

export interface IUser extends Document {
	username: string;
	email: string;
	password?: string;
	otp?: string;
	otpExpires?: Date;
	isVerified: boolean;
	avatar?: string;
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: false,
		},
		avatar: {
			type: String,
			default: null,
		},
		otp: {
			type: String,
			default: null,
		},
		otpExpires: {
			type: Date,
			default: null,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const User: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
