import { Router } from 'express';
import {
	registerUser,
	loginUser,
	logOutUser,
	updateAvaterImage,
	updateAccountDetails,
	updateCoverImage,
	getCurrentUser,
	updatePassword,
	getSubscriptions,
	getMySubscribers,
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
const router = Router();
router.route('/register').post(
	upload.fields([
		{
			name: 'avatar',
			maxCount: 1,
		},
		{
			name: 'coverImage',
			maxCount: 1,
		},
	]),
	registerUser,
);
router.route('/login').post(loginUser);
//secure Routes
router.route('/logout').post(verifyJWT, logOutUser);
router.route('/updatePassword').post(verifyJWT, updatePassword);
router
	.route('/updateAvatar')
	.post(upload.single('avatar'), verifyJWT, updateAvaterImage);
router.route(
	'/updateCoverImage',
	upload.single('coverImage'),
	verifyJWT,
	updateCoverImage,
);
router.route('/updateAccountDetails').post(verifyJWT, updateAccountDetails);
router.route('/getUser').get(verifyJWT, getCurrentUser);
router.route('/getSubscriptions').get(verifyJWT, getSubscriptions);
router.route('/getMySubscribers').get(verifyJWT, getMySubscribers);
export default router;
