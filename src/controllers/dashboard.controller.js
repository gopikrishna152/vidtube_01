// import { Video } from '../models/video.model.js';
// import { Subscription } from '../models/subscription.model.js';
// import { Like } from '../models/like.model.js';
// import { ApiError } from '../utils/ApiError.js';
// import { ApiResponse } from '../utils/ApiResponse.js';
// import { asyncHandler } from '../utils/asyncHandler.js';
import { VideoModel } from '../models/video.model.js';
import { SubscriptionModel } from '../models/subscription.model.js';
import { LikeModel } from '../models/like.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const getChannelStats = asyncHandler(async (req, res) => {
	// TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
	const totalVideos = await VideoModel.countDocuments({
		channel: req.user._id,
	});
	const totalViews = await VideoModel.aggregate([
		{ $match: { channel: req.user._id } },
		{ $group: { _id: null, totalViews: { $sum: '$views' } } },
	]);
	const totalSubscribers = await SubscriptionModel.countDocuments({
		channel: req.user._id,
	});
	const totalLikes = await LikeModel.find({
		video: { $in: req.user.videos },
	}).countDocuments();
	return res.json(
		new ApiResponse(
			200,
			(data = { totalVideos, totalViews, totalSubscribers, totalLikes }),
			'success',
		),
	);
});

const getChannelVideos = asyncHandler(async (req, res) => {
	// TODO: Get all the videos uploaded by the channel
	const videos = await VideoModel.find({ channel: req.user._id })
		.populate('channel')
		.populate('likes')
		.populate('comments');
	return res.json(new ApiResponse(200, (data = { videos }), 'success'));
});
export { getChannelStats, getChannelVideos };
