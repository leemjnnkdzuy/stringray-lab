import mongoose, {Schema, Document, Model} from "mongoose";

export interface IPlotMath extends Document {
	userId: mongoose.Types.ObjectId;
	name: string;
	description?: string;
	isPublic: boolean;
	isPinned: boolean;
	allowViewSource: boolean;
	allowEdit: boolean;
	expression: string;
	createdAt: Date;
	updatedAt: Date;
}

const PlotMathSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			default: "",
			trim: true,
		},
		isPublic: {
			type: Boolean,
			default: false,
		},
		isPinned: {
			type: Boolean,
			default: false,
		},
		allowViewSource: {
			type: Boolean,
			default: false,
		},
		allowEdit: {
			type: Boolean,
			default: false,
		},
		expression: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

const PlotMath: Model<IPlotMath> =
	mongoose.models.PlotMath ||
	mongoose.model<IPlotMath>("PlotMath", PlotMathSchema);

export default PlotMath;
