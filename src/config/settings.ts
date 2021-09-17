import dotenv from 'dotenv-safe';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const { MONGODB_URI } = process.env;
