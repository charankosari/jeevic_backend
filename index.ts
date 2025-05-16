import { app } from './app';
import { config } from './config/env';
import { initDB } from './config/ottoman';
await initDB();

export default {
    port: config.PORT,
    fetch: app.fetch,
};
