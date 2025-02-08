import { Ottoman } from 'ottoman';
import { config } from './env';

const ottoman = new Ottoman({});

const initDB = async () => {
	await ottoman.connect({
		bucketName: config.OTTOMAN_BUCKET_NAME,
		connectionString: config.OTTOMAN_CONNECTION_STRING,
		username: config.OTTOMAN_USERNAME,
		password: config.OTTOMAN_PASSWORD,
	});
	await ottoman.start();
};
export { ottoman, initDB };