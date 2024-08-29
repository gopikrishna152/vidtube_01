import { Router } from 'express';
import * as PlaylistController from '../controllers/playlist.controller.js';
const router = Router();
router.get('/:playlistId', PlaylistController.getPlaylistbyId);
router.post('/:playlistId/add', PlaylistController.addVideoToPlaylist);
router.post('/:playlistId/remove', PlaylistController.removeVideoFromPlaylist);
router.delete('/:playlistId', PlaylistController.deletePlaylistById);
router.put('/:playlistId', PlaylistController.updatePlaylist);
export default router;
