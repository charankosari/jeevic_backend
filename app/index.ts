import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

import { authRoute } from "../routes/auth.route"

const app = new Hono();

app.use(logger());
app.use(cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposeHeaders: ['Content-Type', 'Content-Length'],
}));
app.use(prettyJSON());

app.get('/health', async (c) => {
    return c.text('OK!')
});

app.get('/', async (c) => {
    return c.json({
        message: 'Hello, Dev!',
    });
});

app.route('/auth', authRoute);

showRoutes(app);

export { app };