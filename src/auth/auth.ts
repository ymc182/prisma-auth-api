import jwt from "jsonwebtoken";
import express from "express";
import { Users, PrismaClient } from "@prisma/client";
import { generateKeyPair, hashPassword } from "../helper/crypto";
export type TokenPayload = {
	discord_id: string;
};

export const generateToken = (payload: TokenPayload, tokenSecret: string) => {
	return jwt.sign(payload, tokenSecret, {
		expiresIn: "1h",
	});
};

export function VerifyToken(tokenSecret: string) {
	return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		const authData = req.headers.authorization;
		if (!authData) {
			res.status(401).json({ status: "error", message: "Required Authorization Header" });
			return;
		}
		const token = authData.split(" ")[1];
		const promise = new Promise((resolve, reject) => {
			jwt.verify(token, tokenSecret, (err, decoded) => {
				if (err) {
					console.error(err.message);
					resolve(false);
				}
				resolve(decoded);
			});
		});

		const result = await promise;
		if (!result) {
			res.status(401).json({ status: "error", message: "Unauthorized" });
			return;
		}
		res.locals.tokenPayload = result as TokenPayload;
		next();
	};
}

export function VerifyPassword(prisma: PrismaClient) {
	return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		const discord_id = req.body.discord_id;
		const password = req.body.password;
		const user = await prisma.users.findUnique({
			where: {
				discord_id: discord_id,
			},
		});
		if (!user) {
			res.status(401).json({ status: "error", message: "User Not Found" });
			return;
		}
		const result = hashPassword(password) === user.password_hash;
		if (!result) {
			res.status(401).json({ status: "error", message: "Unauthorized" });
			return;
		}
		next();
	};
}
