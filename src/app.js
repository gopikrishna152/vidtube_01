import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	}),
);

app.use(
	express.json({
		limit: '16kb',
	}),
);
app.use(
	express.urlencoded({
		extended: true,
		limit: '16kb',
	}),
);
app.use(express.static('public'));
app.use(cookieParser());

// import routes
import HealthCheckRouter from './routes/healthcheck.route.js';
import UserRouter from './routes/user.route.js';
import SubscriptionRoute from './routes/subscription.route.js';
import VideoRouter from './routes/video.route.js';
import PlaylistRouter from './routes/playlist.route.js';
import TweetRouter from './routes/tweet.route.js';
import LikeRouter from './routes/like.route.js';
import CommentRouter from './routes/comment.route.js';
// routes;

app.use('/api/v1/healthcheck', HealthCheckRouter);
app.use('/api/v1/user', UserRouter);
app.use('/api/v1/subscription', SubscriptionRoute);
app.use('/api/v1/video', VideoRouter);
app.use('/api/v1/playlist', PlaylistRouter);
app.use('/api/v1/tweet', TweetRouter);
app.use('/api/v1/like', LikeRouter);
app.use('/api/v1/comment', CommentRouter);

export { app };
