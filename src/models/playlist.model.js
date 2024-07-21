import mongoose, { Schema } from 'mongoose';
const PlayListSchema = new Schema(
	{
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		videos: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Video',
			},
		],
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
	},
	{ timeseries: true },
);

export const PlayListModel = mongoose.model('PlayList', PlayListSchema);
