// Configuración de variables de entorno
export const config = {
  // Server
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'tu-jwt-secret-super-seguro',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  
  // CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Database (para futura implementación)
  DATABASE_URL: process.env.DATABASE_URL || '',
  
  // Logs
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

// Validar configuración requerida
export const validateConfig = (): void => {
  const requiredEnvVars = ['JWT_SECRET'];
  
  if (config.NODE_ENV === 'production') {
    requiredEnvVars.push('DATABASE_URL');
  }
  
  const missingVars = requiredEnvVars.filter(
    envVar => !process.env[envVar] && !config[envVar as keyof typeof config]
  );
  
  if (missingVars.length > 0) {
    console.error(`❌ Variables de entorno faltantes: ${missingVars.join(', ')}`);
    process.exit(1);
  }
};