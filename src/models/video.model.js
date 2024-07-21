import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const VideoSchema = new Schema(
	{
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		videoFile: {
			type: String,
			required: true,
		},
		thumbnail: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		views: {
			type: Number,
			default: 0,
		},
		isPublished: {
			type: Number,
			default: true,
		},
	},
	{ timestamps: true },
);
VideoSchema.plugin(mongooseAggregatePaginate);
export const VideoModel = mongoose.model('Video', VideoSchema);
