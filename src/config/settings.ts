import dotenv from 'dotenv-safe';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const { MONGODB_URI, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
