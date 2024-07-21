import {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
import { GoogleAIFileManager } from '@google/generative-ai/server';

const apiKey = process.env.GEMINI_API_KEY;
console.log(apiKey);
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);
async function uploadToGemini(path, mimeType) {
	const uploadResult = await fileManager.uploadFile(path, {
		mimeType,
		displayName: path,
	});
	const file = uploadResult.file;
	console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
	return file;
}
async function waitForFilesActive(files) {
	console.log('Waiting for file processing...');
	for (const name of files.map((file) => file.name)) {
		let file = await fileManager.getFile(name);
		while (file.state === 'PROCESSING') {
			process.stdout.write('.');
			await new Promise((resolve) => setTimeout(resolve, 10_000));
			file = await fileManager.getFile(name);
		}
		if (file.state !== 'ACTIVE') {
			throw Error(`File ${file.name} failed to process`);
		}
	}
	console.log('...all files ready\n');
}

const model = genAI.getGenerativeModel({
	model: 'gemini-1.5-flash',
});

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 8192,
	responseMimeType: 'text/plain',
};

async function run() {
	const files = [
		await uploadToGemini('transactions_2022_2023.csv', 'text/csv'),
	];
	await waitForFilesActive(files);

	const chatSession = model.startChat({
		generationConfig,
		history: [
			{
				role: 'user',
				parts: [
					{
						fileData: {
							mimeType: files[0].mimeType,
							fileUri: files[0].uri,
						},
					},
				],
			},
		],
	});

	const result = await chatSession.sendMessage(
		'where can i should decrease my expenses?',
	);
	console.log(result.response.text());
}

run();
