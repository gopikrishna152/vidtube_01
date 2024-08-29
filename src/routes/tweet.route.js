import { Router } from 'express';
import * as tweetController from '../controllers/tweet.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();
router.post('/', verifyJWT, tweetController.createTweet);
router.get('/', verifyJWT, tweetController.getUserTweet);
router.put('/:tweetId', verifyJWT, tweetController.updateTweet);
router.delete('/:tweetId', verifyJWT, tweetController.deleteTweet);
export default router;
