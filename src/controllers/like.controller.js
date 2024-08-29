import { LikeModel } from '../models/like.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
//if the loggedIn user request the api if he liked the video
//should be deleted and if not the liked a new like should be
//created with the logged user and videoId
const toggleVideoLike = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	//check for the like exit
	const like = await LikeModel.find({
		video: videoId,
		likedBy: req.user._id,
	});
	if (!like) {
		await LikeModel.create({
			video: videoId,
			likedBy: req.user._id,
		});
	} else {
		await LikeModel.deleteOne({ video: videoId, likedBy: req.user._id });
	}
	return res.status(200).json(new ApiResponse(200, null, 'success'));
});
const toggleCommentLike = asyncHandler(async (req, res) => {
	const { commentId } = req.params;
	//TODO: toggle like on comment
	//check for the like exit
	const like = await LikeModel.find({
		comment: commentId,
		likedBy: req.user._id,
	});
	if (!like) {
		await LikeModel.create({
			comment: commentId,
			likedBy: req.user._id,
		});
	} else {
		await LikeModel.deleteOne({ comment: commentId, likedBy: req.user._id });
	}
	return res.status(200).json(new ApiResponse(200, null, 'success'));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
	const { tweetId } = req.params;
	//TODO: toggle like on tweet
	//check for the like exit
	const like = await LikeModel.find({
		tweet: tweetId,
		likedBy: req.user._id,
	});
	if (!like) {
		await LikeModel.create({
			tweet: tweetId,
			likedBy: req.user._id,
		});
	} else {
		await LikeModel.deleteOne({ tweet: tweetId, likedBy: req.user._id });
	}
	return res.status(200).json(new ApiResponse(200, null, 'success'));
});

const getLikedVideos = asyncHandler(async (req, res) => {
	//the populate method is used to print the video details without only the videoId
	const likedVideos = await LikeModel.find({ likedBy: req.user._id }).populate(
		'video',
	);
	if (likedVideos.length === 0) {
		return res.status(404).json(new ApiResponse(404, null, 'No videos'));
	}
	res.status(200).json(new ApiResponse(200, likedVideos, 'All Liked Videos'));
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
