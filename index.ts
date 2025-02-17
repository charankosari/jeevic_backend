import { app } from './app';
import { initDB } from './config/ottoman';

await initDB();

export default app;