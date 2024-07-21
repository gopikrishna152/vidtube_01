import mongoose, { Schema } from 'mongoose';
const LikeSchema = new Schema(
	{
		//this like can be for comment,video or tweet and others can be null
		comment: {
			type: Schema.Types.ObjectId,
			ref: 'Comment',
		},
		video: {
			type: Schema.Types.ObjectId,
			ref: 'Video',
		},
		tweet: { type: Schema.Types.ObjectId, ref: 'Tweet' },
		likedBy: { type: Schema.Types.ObjectId, ref: 'User' },
	},
	{ timeseries: true },
);
export const LikeModel = mongoose.model('Like', LikeSchema);
