import { z } from 'zod';

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envSchema> {}
	}
}

export const envSchema = z.object({
	PORT: z.string(),
	NODE_ENV: z.string(),
	OTTOMAN_BUCKET_NAME: z.string(),
	OTTOMAN_CONNECTION_STRING: z.string(),
	OTTOMAN_USERNAME: z.string(),
	OTTOMAN_PASSWORD: z.string(),
	JWT_SECRET: z.string(),
	JWT_EXPIRES_IN: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const config = envSchema.parse(process.env);