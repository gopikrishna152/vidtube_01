import { TweetModel } from '../models/tweet.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
const createTweet = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const tweet = await TweetModel.create({
		content,
		owner: req.user._id,
	});
	return res.status(201).json(new ApiResponse(201, tweet, 'success'));
});
const getUserTweet = asyncHandler(async (req, res) => {
	const tweets = await TweetModel.find({ owner: req.user._id }).populate(
		'owner',
	);
	if (!tweets) {
		throw new ApiError(404, 'No tweet found');
	}
	return res.status(200).json(new ApiResponse(200, tweets, 'success'));
});
const updateTweet = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const tweet = await TweetModel.findById(req.params.tweetId);
	if (!tweet) {
		throw new ApiError(404, 'Tweet not found');
	}
	tweet.content = content;
	await tweet.save();
	return res.status(200).json(new ApiResponse(200, tweet, 'success'));
});

const deleteTweet = asyncHandler(async (req, res) => {
	//TODO: delete tweet
	const tweet = await TweetModel.findByIdAndDelete(req.params.tweetId);
	if (!tweet) {
		throw new ApiError(404, 'Tweet not found');
	}
	return res.status(204).json(new ApiResponse(204, null, 'success'));
});
export { createTweet, getUserTweet, updateTweet, deleteTweet };
