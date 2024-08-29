import { Router } from 'express';
import {
	publishVideo,
	getAllVideos,
	getVideoById,
	updateVideo,
} from '../controllers/videos.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
const router = Router();
router.route('/getVideo/:videoId').get(getVideoById);
router.route('/getAllVideos').get(getAllVideos);
router.route('/publishVideo').post(
	upload.fields([
		{ name: 'video', maxCount: 1 },
		{ name: 'thumbnail', maxCount: 1 },
	]),
	verifyJWT,
	publishVideo,
);
router.route('/updateVideo/:videoId').put(updateVideo);

export default router;
