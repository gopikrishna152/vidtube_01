import { VideoModel } from '../models/video.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { ApiResponse } from '../utils/ApiResponse.js';
import fs from 'fs';
import { ApiError } from '../utils/ApiError.js';
const getAllVideos = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10, sortBy, userId } = req.query;
	const sortObj = {};
	sortObj[sortBy] = -1;
	let skip = (page - 1) * limit;
	const videos = await VideoModel.find({ owner: userId })
		.sort(sortObj)
		.skip(skip)
		.limit(limit);
	res.status(200).json(new ApiResponse(200, videos, 'All Videos'));
});
const getVideoById = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	const video = await VideoModel.findById(videoId);
	if (!video) {
		throw new ApiError(404, 'Video Not Found');
	}
	video.views = video.views + 1;
	video.save();
	res.status(200).json(new ApiResponse(200, video, 'Video'));
});
const publishVideo = asyncHandler(async (req, res) => {
	const { title, description } = req.body;
	const videoPath = req.files.video[0].path;
	const thumbnailPath = req.files.thumbnail[0].path;
	const videoUrl = await uploadOnCloudinary(videoPath);
	const thumbnailUrl = await uploadOnCloudinary(thumbnailPath);

	if (!thumbnailUrl) {
		throw new ApiError(404, 'Thumbnail  not Uploaded Correctly');
	}
	if (!videoUrl) {
		throw new ApiError(404, 'VideoFile not Uploaded Correctly');
	}
	const duration = await getVideoDurationInSeconds(videoPath);
	const obj = {
		owner: req.user._id,
		videoFile: videoUrl,
		thumbnail: thumbnailUrl,
		title,
		description,
		duration,
	};
	const video = await VideoModel.create(obj);
	if (videoUrl && thumbnailUrl) {
		fs.unlinkSync(videoPath);
		fs.unlinkSync(thumbnailPath);
	}
	return res
		.status(200)
		.json(new ApiResponse(201, video, 'Video Published Successfully'));
});
const updateVideo = asyncHandler(async (req, res) => {
	const { title, description } = req.body;
	const { videoId } = req.params;
	const updatedThumbnailUrl = await uploadOnCloudinary(req.file.path);
	const video = await VideoModel.findByIdAndUpdate(
		videoId,
		{
			$set: {
				title,
				description,
				thumbnail: updatedThumbnailUrl,
			},
		},
		{ new: true },
	);
	return res.status(200).json(new ApiResponse(200, video, 'Video Updated'));
});
export { getAllVideos, publishVideo, getVideoById };
