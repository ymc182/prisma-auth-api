import express from "express";
import { generateToken } from "../middlewares/auth";

import { TokenResponseHandler } from "../utils/httpResponse";
import { TOKEN_SECRET } from "../config";

export async function generateJwt(req: express.Request, res: express.Response, next: express.NextFunction) {
	const discord_id = req.body.discord_id;

	const token = generateToken(
		{
			discord_id: discord_id,
		},
		TOKEN_SECRET
	);
	TokenResponseHandler(res, token);
}
