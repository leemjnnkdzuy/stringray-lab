import mongoose, {Schema, Document, Model} from "mongoose";

export type PlotType = "js" | "matlab" | "math";

export interface IPlotMathLab extends Document {
	userId: mongoose.Types.ObjectId;
	name: string;
	description?: string;
	type: PlotType;
	isPublic: boolean;
	allowViewSource: boolean;
	allowEdit: boolean;
	sourceCode: string;
	createdAt: Date;
	updatedAt: Date;
}

const PlotMathLabSchema = new Schema(
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
		type: {
			type: String,
			enum: ["js", "matlab", "math"],
			required: true,
		},
		isPublic: {
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
		sourceCode: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

const PlotMathLab: Model<IPlotMathLab> =
	mongoose.models.PlotMathLab ||
	mongoose.model<IPlotMathLab>("PlotMathLab", PlotMathLabSchema);

export default PlotMathLab;
