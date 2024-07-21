import { UserModel } from '../models/user.model.js';
import { SubscriptionModel } from '../models/subscription.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
//if the loggedIn user request the api if he subscribed the subscription
//should be deleted and if not the subscribed a new subscription should be
//created with the logged user and channelId
const toggleSubscription = asyncHandler(async (req, res) => {
	const { channelId } = req.params;
	//check for the Subscription exit
	const subscription = await SubscriptionModel.find({
		subscriber: req.user._id,
		channel: channelId,
	});
	if (subscription.length === 0) {
		//create the subscription
		const createdSubscription = await SubscriptionModel.create({
			subscriber: req.user._id,
			channel: channelId,
		});
		return res.status(201).json(
			new ApiResponse(
				201,
				{
					subscription: createdSubscription,
					value: true,
				},
				'Subscription Created or Added',
			),
		);
	}
	await SubscriptionModel.deleteOne({
		subscriber: req.user._id,
		channel: channelId,
	});
	res
		.status(200)
		.json(new ApiResponse(200, { value: false }, 'Subscription Deleted'));
});
export { toggleSubscription };
