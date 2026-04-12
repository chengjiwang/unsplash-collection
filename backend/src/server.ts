import 'dotenv/config';
import app from './app.ts';
import { connectDB, disconnectDB } from './lib/prisma.ts';

const PORT = process.env.PORT ?? 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDB().catch((err) => {
  console.error('Failed to connect to database on startup:', err);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
