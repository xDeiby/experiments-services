/* eslint-disable no-undef */
import dotenv from 'dotenv-safe';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const URI = process.env.NODE_ENV === 'test' ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI;
export const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
