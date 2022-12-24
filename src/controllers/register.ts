import express from "express";

import prisma from "../../client";
import { createUser } from "../model/user";
import { UserResponseHandler } from "../utils/httpResponse";

//TODO: should using discord token to verify user
export async function register(req: express.Request, res: express.Response, next: express.NextFunction) {
	if (!req.body.discord_id || !req.body.password) {
		res.status(400).json({ status: "error", message: "discord_id and password are required" });
		return;
	}
	const result = await createUser(prisma, req.body.discord_id, req.body.password);
	UserResponseHandler(res, result);
	console.log("User created", result.ok ? result.value.discord_id : result.error.message);
}
