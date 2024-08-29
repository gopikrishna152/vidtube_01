import { asyncHandler } from '../middlewares/asyncHandler.js';
import { CommentModel } from '../models/comment.model.js';
import { VideoModel } from '../models/video.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
const getVideoComments = asyncHandler(async (req, res) => {
	//TODO: get all comments for a video
	const { videoId } = req.params;
	const { page = 1, limit = 10 } = req.query;
	const skip = (page - 1) * limit;
	const comments = await CommentModel.find({ video: videoId })
		.skip(skip)
		.limit(limit)
		.populate('owner');
	if (!videos) {
		throw new ApiError(404, 'No Comments Found');
	}
	return res.status(200).json(new ApiResponse(200, comments, 'success'));
});

const addComment = asyncHandler(async (req, res) => {
	// TODO: add a comment to a video
	const { videoId } = req.params;
	const { content } = req.body;
	const comment = await CommentModel.create({
		video: videoId,
		owner: req.user._id,
		content,
	});
	return res.status(201).json(new ApiResponse(201, comment, 'success'));
});

const updateComment = asyncHandler(async (req, res) => {
	// TODO: update a comment
	const { commentId } = req.params;
	const { content } = req.body;
	const comment = await CommentModel.findByIdAndUpdate(
		commentId,
		{ $set: { content } },
		{ new: true },
	);
	if (!comment) {
		throw new ApiError(404, 'Comment not found');
	}
	return res.status(200).json(new ApiResponse(200, comment, 'success'));
});

const deleteComment = asyncHandler(async (req, res) => {
	// TODO: delete a comment
	const { commentId } = req.params;
	const comment = await CommentModel.findByIdAndDelete(commentId);
	if (!comment) {
		throw new ApiError(404, 'Comment not found');
	}
	return res.status(204).json(new ApiResponse(204, null, 'success'));
});
export { getVideoComments, addComment, updateComment, deleteComment };
