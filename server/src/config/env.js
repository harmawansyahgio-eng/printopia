require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  supabaseBucket: process.env.SUPABASE_BUCKET,
  fonnteApiKey: process.env.FONNTE_API_KEY,
  fonnteEnabled: process.env.FONNTE_ENABLED === 'true',
};

// Validate required environment variables
const requiredEnvs = ['databaseUrl', 'jwtSecret', 'supabaseUrl', 'supabaseKey'];
for (const key of requiredEnvs) {
  if (!env[key]) {
    console.error(`[ENV ERROR] Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

module.exports = env;
