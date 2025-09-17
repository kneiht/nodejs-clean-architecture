import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Required environment variables
const requiredEnvVars = ['NODE_ENV', 'PORT', 'DATABASE_URL', 'JWT_SECRET', 'BCRYPT_ROUNDS'];

// Check for missing environment variables
const missingVars = requiredEnvVars.filter((key) => !process.env[key] || process.env[key] === '');
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variable(s): ${missingVars.join(', ')}`);
}

// Environment configuration object
export const env = {
  NODE_ENV: process.env.NODE_ENV?.toString() || 'development',
  PORT: process.env.PORT?.toString() || '3000',
  DATABASE_URL: process.env.DATABASE_URL?.toString() || '',
  JWT_SECRET: process.env.JWT_SECRET?.toString() || '',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_EXPIRES_IN?.toString() || '1h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN?.toString() || '7h',
  BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS?.toString() || '12',
  DB_SELECT: process.env.DB_SELECT?.toString() || 'IN_MEMORY',
};

// Environment type checking
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Validate JWT_SECRET length for security
if (env.JWT_SECRET.length < 32) {
  console.warn('⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security!');
}

// Validate configuration
console.log('🔧 Environment Configuration Report:');
console.log(`     - NODE_ENV: ${env.NODE_ENV}`);
console.log(`     - PORT: ${env.PORT}`);
console.log(`     - DATABASE_URL: ${env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`     - JWT_SECRET: ${env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`     - JWT_ACCESS_EXPIRES_IN: ${env.JWT_ACCESS_EXPIRES_IN}`);
console.log(`     - JWT_REFRESH_EXPIRES_IN: ${env.JWT_REFRESH_EXPIRES_IN}`);
console.log(`     - BCRYPT_ROUNDS: ${env.BCRYPT_ROUNDS}`);
console.log(`     - DB_SELECT: ${env.DB_SELECT}`);
