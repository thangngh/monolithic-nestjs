import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT as string, 10) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: (process.env.DB_PASSWORD as string) || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  logging: process.env.DB_LOGGING === 'true' || false,
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
}));
