import type { Context } from 'hono';

import { UploaderService } from "../services/upload.service";

export class UploadController {
	public static async uploadFile(ctx: Context) {
		try {
			const { file } = await ctx.req.parseBody();

			if (!file || typeof file == 'string') {
				return ctx.json(
                    {
                        message: 'Invalid file',
                        is_error: true,
                    },
                    400,
                );
			}

			const upload_status = await UploaderService.upload(file);

			return ctx.json(
				upload_status
			);
		} catch (error) {
			if (error instanceof Error) {
				return ctx.json(
					{
						message: error.message,
						is_error: true,
					},
					500,
				);
			}
		}
	}
}