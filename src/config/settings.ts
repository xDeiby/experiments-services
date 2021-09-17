import dotenv from 'dotenv-safe';

dotenv.config();

export const { PORT, MONGODB_URI } = process.env;
