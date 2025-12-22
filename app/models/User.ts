import mongoose, {Schema, Document, Model} from "mongoose";

export interface ISocialLinks {
	facebook?: string;
	twitter?: string;
	github?: string;
	linkedin?: string;
	instagram?: string;
	website?: string;
}

export interface IVisibilitySettings {
	bio?: boolean;
	birthday?: boolean;
	location?: boolean;
	workplace?: boolean;
	socialLinks?: {
		facebook?: boolean;
		twitter?: boolean;
		github?: boolean;
		linkedin?: boolean;
		instagram?: boolean;
		website?: boolean;
	};
}

export interface IUser extends Document {
	username: string;
	email: string;
	password?: string;
	otp?: string;
	otpExpires?: Date;
	isVerified: boolean;
	avatar?: string;
	birthday?: Date;
	location?: string;
	workplace?: string;
	bio?: string;
	socialLinks?: ISocialLinks;
	visibilitySettings?: IVisibilitySettings;
	createdAt: Date;
	updatedAt: Date;
}

const SocialLinksSchema = new Schema(
	{
		facebook: {type: String, default: null},
		twitter: {type: String, default: null},
		github: {type: String, default: null},
		linkedin: {type: String, default: null},
		instagram: {type: String, default: null},
		website: {type: String, default: null},
	},
	{_id: false}
);

const VisibilitySettingsSchema = new Schema(
	{
		bio: {type: Boolean, default: true},
		birthday: {type: Boolean, default: true},
		location: {type: Boolean, default: true},
		workplace: {type: Boolean, default: true},
		socialLinks: {
			facebook: {type: Boolean, default: true},
			twitter: {type: Boolean, default: true},
			github: {type: Boolean, default: true},
			linkedin: {type: Boolean, default: true},
			instagram: {type: Boolean, default: true},
			website: {type: Boolean, default: true},
		},
	},
	{_id: false}
);

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
		birthday: {
			type: Date,
			default: null,
		},
		location: {
			type: String,
			default: null,
			trim: true,
		},
		workplace: {
			type: String,
			default: null,
			trim: true,
		},
		bio: {
			type: String,
			default: null,
			maxlength: 500,
		},
		socialLinks: {
			type: SocialLinksSchema,
			default: null,
		},
		visibilitySettings: {
			type: VisibilitySettingsSchema,
			default: () => ({
				bio: true,
				birthday: true,
				location: true,
				workplace: true,
				socialLinks: true,
			}),
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
