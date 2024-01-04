import mongoose, { Connection } from 'mongoose';
import AppError from '@utils/AppError';
import dotenv from 'dotenv';
dotenv.config();

const dbUser: string | undefined = process.env.DBUSER;
const dbPass: string | undefined = process.env.DBPASS;
const dbLocal: string | undefined = process.env.DBLOCAL;

if (!dbUser || !dbPass || !dbLocal) {
  throw new AppError(
    'Database credentials are missing in the environment variables.',
  );
}

mongoose.connect(
  `mongodb://${dbUser}:${dbPass}@193.203.183.204:27017/${dbLocal}`,
);

const db: Connection = mongoose.connection;

export default db;
