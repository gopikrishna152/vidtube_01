import { PlayListModel } from '../models/playlist.model';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
const createPlaylist = asyncHandler(async (req, res) => {
	const { name, description } = req.body;
	const paylist = new PlayListModel({
		owner: req.user._id,
		name,
		description,
	});
	await paylist.save();
	res
		.status(201)
		.json(new ApiResponse(201, paylist, 'Playlist Created Successfully'));
});
const getUserPlaylists = asyncHandler(async (req, res) => {
	const playlists = await PlayListModel.find({ owner: req.user._id });
	if (playlists.length === 0) {
		return res
			.status(404)
			.json(new ApiResponse(404, null, 'No playlist found'));
	}
	res
		.status(200)
		.json(new ApiResponse(200, playlists, 'Playlists fetched success'));
});
const getPlaylistbyId = asyncHandler(async (req, res) => {
	const playlist = await PlayListModel.findById(req.params.playlistId);
	if (!playlist) {
		return res
			.status(404)
			.json(new ApiResponse(404, null, 'Playlist not found'));
	}
	res
		.status(200)
		.json(new ApiResponse(200, playlist, 'Playlist fetched successfully'));
});
const addVideoToPlaylist = asyncHandler(async (req, res) => {
	const { videoId } = req.body;
	const playlist = await PlayListModel.findById(req.params.playlistId);
	if (!playlist) {
		return res
			.status(404)
			.json(new ApiResponse(404, null, 'Playlist not found'));
	}
	playlist.vidoes.push(videoId);
	await playlist.save();
	res
		.status(200)
		.json(
			new ApiResponse(200, playlist, 'Video added to playlist successfully'),
		);
});
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
	const { videoId } = req.body;
	const playlist = await PlayListModel.findById(req.params.playlistId);
	if (!playlist) {
		return res
			.status(404)
			.json(new ApiResponse(404, null, 'Playlist not found'));
	}
	playlist.videos = playlist.videos.filter((id) => id !== videoId);
	await playlist.save();
	res
		.status(200)
		.json(
			new ApiResponse(
				200,
				playlist,
				'Video removed from playlist successfully',
			),
		);
});
const deletePlaylistById = asyncHandler(async (req, res) => {
	const playlist = await PlayListModel.findByIdAndDelete(req.params.playlistId);
	if (!playlist) {
		return res
			.status(404)
			.json(new ApiResponse(404, null, 'Playlist not found'));
	}
	res
		.status(200)
		.json(new ApiResponse(200, playlist, 'Playlist deleted successfully'));
});
const updatePlaylist = asyncHandler(async (req, res) => {
	const { name, description } = req.body;
	const playlist = await PlayListModel.findByIdAndUpdate(
		req.params.playlistId,
		{
			$set: { name, description },
		},
		{
			new: true,
		},
	);
	if (!playlist) {
		return res
			.status(404)
			.json(new ApiResponse(404, null, 'Playlist not found'));
	}
	res
		.status(200)
		.json(new ApiResponse(200, playlist, 'Playlist updated successfully'));
});
export {
	createPlaylist,
	getUserPlaylists,
	getPlaylistbyId,
	addVideoToPlaylist,
	removeVideoFromPlaylist,
	deletePlaylistById,
};
