import dotenv from 'dotenv'

// Cargar variables de entorno desde .env
dotenv.config()

// Configuración de variables de entorno
export const config = {
  // Server
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB por defecto
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  
  // Logs
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Validar configuración requerida
export const validateConfig = (): void => {
  const requiredEnvVars: (keyof typeof config)[] = ['JWT_SECRET', 'DATABASE_URL'];
  
  const missingVars = requiredEnvVars.filter(
    envVar => !config[envVar]
  );
  
  if (missingVars.length > 0) {
    console.error(`❌ Variables de entorno faltantes: ${missingVars.join(', ')}`);
    console.error('💡 Copia .env.example a .env y configura los valores correctos');
    process.exit(1);
  }
  
  console.log('✅ Configuración de entorno validada correctamente');
};