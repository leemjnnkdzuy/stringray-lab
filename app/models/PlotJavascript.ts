import mongoose, {Schema, Document, Model} from "mongoose";

export interface IPlotJavascript extends Document {
	userId: mongoose.Types.ObjectId;
	name: string;
	description?: string;
	isPublic: boolean;
	isPinned: boolean;
	allowViewSource: boolean;
	allowEdit: boolean;
	sourceCode: string;
	createdAt: Date;
	updatedAt: Date;
}

const PlotJavascriptSchema = new Schema(
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
		sourceCode: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

const PlotJavascript: Model<IPlotJavascript> =
	mongoose.models.PlotJavascript ||
	mongoose.model<IPlotJavascript>("PlotJavascript", PlotJavascriptSchema);

export default PlotJavascript;
