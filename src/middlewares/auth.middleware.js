import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
export const verifyJWT = asyncHandler(async (req, res, next) => {
	const accessToken =
		req.cookies?.accessToken ||
		req.header('Authorization')?.replace('Bearer ', '');
	if (!accessToken) {
		throw new ApiError(500, 'No Access Token');
	}
	const data = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
	if (!data) {
		throw new ApiError(500, 'UnAuthorized');
	}
	const user = await UserModel.findById(data._id).select(
		'-password -refreshToken',
	);
	if (!user) {
		throw new ApiError(500, 'No User');
	}
	req.user = user;
	next();
});
