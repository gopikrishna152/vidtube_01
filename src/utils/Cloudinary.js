import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config({
	cloud_name: 'dltz5rv4d',
	api_key: '117541873568673',
	api_secret: '1bmasclDLqPOkn5VxstIZe-1V5g', // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (filePath) => {
	try {
		if (!filePath) {
			return null;
		}
		const response = await cloudinary.uploader.upload(filePath, {
			resource_type: 'auto',
		});
		// console.log('Uploaded Succefully cloudinary');
		// console.log(response.url);

		return response.url;
	} catch (error) {
		fs.unlinkSync(filePath);
		return null;
	}
};
const deleteOnCloudinary = async (url) => {
	try {
		const value = await cloudinary.delete_resources(['maqvbl0oos5eztdn13vu'], {
			type: 'upload',
			resource_type: 'image',
		});
		console.log(value);
	} catch (error) {
		throw new Error('Error While Deleting Images on cloudinary');
	}
};
export { uploadOnCloudinary, deleteOnCloudinary };
