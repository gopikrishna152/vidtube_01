import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { UserModel } from '../models/user.model.js';
import { uploadOnCloudinary, deleteOnCloudinary } from '../utils/Cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { SubscriptionModel } from '../models/subscription.model.js';
import jwt from 'jsonwebtoken';
const generateAccessAndRefreshToken = async (userId) => {
	const user = await UserModel.findById(userId);
	// console.log(user);
	const accessToken = await user.generateAccessToken();
	const refreshToken = await user.generateRefreshToken();
	user.refreshToken = refreshToken;
	await user.save();
	return { refreshToken, accessToken };
};
const registerUser = asyncHandler(async (req, res) => {
	// get user details from frontend
	// console.log('hello');
	const { username, fullName, email, password } = req.body;
	// validation - not empty
	if (
		[username, fullName, email, password].some((value) => value?.trim() === '')
	) {
		throw new ApiError(500, 'All Fields Are Required');
	}
	// check if user already exists: username, email
	const existedUser = await UserModel.findOne({
		$or: [{ username }, { email }],
	});
	if (existedUser) {
		throw new ApiError(500, 'User Already Exists');
	}
	// check for images, check for avatar
	const avatarFilePath = req.files?.avatar[0]?.path;
	const coverImageFilePath = req.files?.avatar[0]?.path;
	// let avatarLocal;
	// if (req.files) {
	// 	if (Array.isArray(req.files.avatar) && req.files.avatar[0].length > 0) {
	// 	}
	// }
	if (!avatarFilePath) {
		throw new ApiError(500, 'CoverImage Not Uploaded Succesfully');
	}
	if (!coverImageFilePath) {
		console.log('Cover Image File Not Uploaded');
	}
	// upload them to cloudinary, avatar
	const avatarImageUrl = await uploadOnCloudinary(avatarFilePath);
	const coverImageUrl = await uploadOnCloudinary(coverImageFilePath);
	if (!avatarImageUrl) {
		throw new ApiError(500, 'Images are Not Uploaded to Cloudinary');
	}
	// create user object - create entry in db
	const user = await UserModel.create({
		username: username.toLowerCase(),
		password,
		fullName,
		email,
		avatar: avatarImageUrl?.url,
		coverImage: coverImageUrl?.url || '',
	});
	// remove password and refresh token field from response
	const createdUser = await UserModel.findById({ _id: user._id }).select(
		'-password -refreshToken',
	);
	// check for user creation
	if (!createdUser) {
		throw new ApiError(500, 'User is not Created In Database');
	}

	// return res
	res
		.status(201)
		.json(new ApiResponse(201, createdUser, 'User Created SuccessFully'));
});
const loginUser = asyncHandler(async (req, res) => {
	const { email, username, password } = req.body;
	if (!email && !password) {
		throw new ApiError(401, 'Email or Username not given');
	}
	const user = await UserModel.findOne({ $or: [{ username }, { email }] });
	if (!user) {
		throw new ApiError(500, 'User with this email and userName is not found');
	}
	const passwordCheck = await user.isPasswordCorrect(password);
	if (passwordCheck === false) {
		throw new ApiError(500, 'Invalid Password');
	}
	const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
		user._id,
	);
	const loggedUser = await UserModel.findById(user._id).select(
		'-password -refreshToken',
	);
	const options = {
		httpOnly: true,
		secure: true,
	};
	res
		.status(200)
		.cookie('accessToken', accessToken, options)
		.cookie('refreshToken', refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{ loggedUser, accessToken, refreshToken },
				'Logged In',
			),
		);
});
const logOutUser = asyncHandler(async (req, res) => {
	const user = req.user;
	await UserModel.findByIdAndUpdate(
		user._id,
		{
			$unset: { refreshToken: 1 },
		},
		{ new: true },
	);
	const options = {
		httpOnly: true,
		secure: true,
	};
	res
		.status(200)
		.clearCookie('accessToken', options)
		.clearCookie('refreshToken', options)
		.json(new ApiResponse(200, {}, 'User Logged Out'));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
	// we need to get refreshToken
	//1.we get from cookies
	//2.we get from req.body which is sent by frontend
	const refreshToken = req.cookies.refreshToken || req.body;
	if (!refreshToken) {
		throw new ApiError(500, 'No Refresh Token');
	}
	const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
	const user = await UserModel.findById(decoded._id);
	if (user.refreshToken !== refreshToken) {
		throw new ApiError(500, 'UnAurthorized Access');
	}
	const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(
		user._id,
	);
	const options = {
		httpOnly: true,
		secure: true,
	};
	res
		.status(200)
		.cookie('accessToken', accessToken, options)
		.cookie('refreshToken', newRefreshToken, options)
		.json(
			new ApiResponse(
				200,
				(data = {
					accessToken,
					refreshToken: newRefreshToken,
				}),
				'accesToken Refreshed',
			),
		);
});
const updatePassword = asyncHandler(async (req, res) => {
	const { orginalPassword, newPassword } = req.body;
	if (!orginalPassword || !newPassword) {
		throw new ApiError(500, 'All Fields Are Mandatory');
	}
	//compare the the orginal password whether it is correct or wrong
	//1.we need to get the user
	const user = await UserModel.findById(req.user._id);
	const passwordCheck = await user.isPasswordCorrect(orginalPassword);
	if (!passwordCheck) {
		throw new ApiError(500, 'Incorrect Password');
	}
	await UserModel.findByIdAndUpdate(
		user._id,
		{
			$set: { password: newPassword },
		},
		{ new: true },
	);
	res.status(200).json(new ApiResponse(200, {}, 'Password Updated Succefully'));
});
const getCurrentUser = asyncHandler(async (req, res) => {
	return res.status(200).json(new ApiResponse(200, req.user, 'User data'));
});
const updateAccountDetails = asyncHandler(async (req, res) => {
	const { email, fullName } = req.body;
	if (!email && !fullName) {
		throw new Error('All Fields Are required');
	}
	const updatedUser = await UserModel.findByIdAndUpdate(
		req.user._id,
		{
			$set: { fullName, email },
		},
		{ new: true },
	).select('-password');
	res
		.status(200)
		.json(new ApiResponse(200, updatedUser, 'User details updated'));
});
const updateAvaterImage = asyncHandler(async (req, res) => {
	const imagePath = req.file?.path;
	if (!imagePath) {
		throw new ApiError(404, 'Path Not Found');
	}
	const cloudinaryUrl = await uploadOnCloudinary(imagePath);
	console.log(cloudinaryUrl);
	if (!cloudinaryUrl) {
		throw new ApiError(400, 'Cloudinary Url Not Found');
	}
	// const beforeUpdate = await UserModel.findById(req.user._id);
	// console.log('url of before updated');
	// const isDeleted = await deleteOnCloudinary(beforeUpdate.avatar);
	// console.log('iDeleted', isDeleted);

	const updatedUser = await UserModel.findByIdAndUpdate(
		req.user._id,
		{
			$set: { avatar: cloudinaryUrl },
		},
		{ new: true },
	).select('-password -refreshToken');
	res
		.status(200)
		.json(new ApiResponse(200, updatedUser, 'Avater updated Succefully'));
});
const updateCoverImage = asyncHandler(async (req, res) => {
	const imagePath = req.file?.path;
	if (!imagePath) {
		throw new ApiError(404, 'Path Not Found');
	}
	const cloudinaryUrl = await uploadOnCloudinary(imagePath).url;
	if (!cloudinaryUrl) {
		throw new ApiError(400, 'Cloudinary Url Not Found');
	}
	const updatedUser = await UserModel.findByIdAndUpdate(
		req.user._id,
		{
			$set: { coverImage: cloudinaryUrl },
		},
		{ new: true },
	).select('-password -refreshToken');
	res
		.status(200)
		.json(new ApiResponse(200, updatedUser, 'CoverImage updated Succefully'));
});
// const getUserChannelProfile = asyncHandler(async (req, res) => {});
const getSubscriptions = asyncHandler(async (req, res) => {
	const subscriptions = await SubscriptionModel.find({
		subscriber: req.user._id,
	});
	if (subscriptions.length === 0) {
		return res
			.status(200)
			.json(new ApiResponse(200, { count: 0 }, 'No Subscriptions'));
	}
	res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ subscriptions, count: subscriptions.length },
				'This are the Subscription u subscribed to',
			),
		);
});
const getMySubscribers = asyncHandler(async (req, res) => {
	//channelId should req.user._id
	const subscribers = await SubscriptionModel.find({ channel: req.user._id });
	if (subscribers.length === 0) {
		return res
			.status(200)
			.json(new ApiResponse(200, { count: 0 }, 'No Subscribers'));
	}
	res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{ subscribers, count: subscribers.length },
				'Subscribers List',
			),
		);
});
export {
	updateAccountDetails,
	registerUser,
	loginUser,
	logOutUser,
	updatePassword,
	getCurrentUser,
	updateAvaterImage,
	updateCoverImage,
	getSubscriptions,
	getMySubscribers,
};
