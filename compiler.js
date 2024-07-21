// // let promise = new Promise((resolve, reject) => {
// // 	//
// // 	const value = true;
// // 	if (value) {
// // 		resolve(() => {
// // 			setTimeout(() => {
// // 				console.log('executed after 2 sec');
// // 			}, 2000);
// // 		});
// // 	} else {
// // 		reject(() => {
// // 			console.log('rejected');
// // 		});
// // 	}
// // });
// // promise
// // 	.then((calback) => {
// // 		calback();
// // 	})
// // 	.catch((error) => {
// // 		error();
// // 	});
// // const asyncHandler = (callback) => {
// // 	return (a, b, c) => {
// // 		callback(a, b, c);
// // 	};
// // };
// // asyncHandler();
// const asyncHandler = (callBackHandler) => {
// 	return (a, b) => {
// 		Promise.resolve(callBackHandler(a, b)).catch((error) => {
// 			cons;
// 		});
// 	};
// };

// function executed(a, b) {
// 	console.log(a);
// 	console.log(b);
// }
// asyncHandler(executed(1, 2));
// class Api {
// 	constructor(message) {
// 		this.message = message;
// 	}
// 	method() {
// 		console.log(this.message);
// 	}
// }
// const obj = new Api({
// 	message: 'Hello',
// });
// console.log(typeof obj.message);
// // console.log(obj.errors);
// obj.method();
// const asyncHandler = (asynFunction) => {
// 	return () => {
// 		Promise.resolve(asynFunction).catch((error) => console.log(error));
// 	};
// };
// import crypto from 'crypto';
// var token = crypto.randomBytes(64).toString('hex');
// console.log(token);
console.log('hello world');
