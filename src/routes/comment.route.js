import { Router } from 'express';
import * as CommentController from '../controllers/comment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();
router.get('/video/:videoId', verifyJWT, CommentController.getVideoComments);
router.post('/video/:videoId', verifyJWT, CommentController.addComment);
router.put('/:commentId', verifyJWT, CommentController.updateComment);
router.delete('/:commentId', verifyJWT, CommentController.deleteComment);
export default router;
