import { Router } from 'express';
import * as likeController from '../controllers/like.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();
router.post('/video/:videoId', verifyJWT, likeController.toggleVideoLike);
router.post('/comment/:commentId', verifyJWT, likeController.toggleCommentLike);
router.post('/tweet/:tweetId', verifyJWT, likeController.toggleTweetLike);
router.get('/video/:videoId', verifyJWT, likeController.getLikedVideos);
export default router;
