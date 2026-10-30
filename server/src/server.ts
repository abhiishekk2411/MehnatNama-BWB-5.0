import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`===============================================`);
  console.log(` Hisaab-Saboot API Server Running`);
  console.log(` Port: ${env.PORT} | Environment: ${env.NODE_ENV}`);
  console.log(` Local URL: http://localhost:${env.PORT}`);
  console.log(`===============================================`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
  });
});
