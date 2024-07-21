import mongoose, { Schema } from 'mongoose';
const SubscriptionSchema = new Schema(
	{
		subscriber: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		channel: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timeseries: true },
);
export const SubscriptionModel = mongoose.model(
	'Subscription',
	SubscriptionSchema,
);
