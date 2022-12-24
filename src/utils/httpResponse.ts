import { Users } from "@prisma/client";
import express from "express";
import { PrismaResult } from "../types/errors";
export function UserResponseHandler(res: express.Response, result: PrismaResult<Users, Error>) {
	if (!result.ok) {
		res.status(400).json({ status: "error", message: result.error.message });
	} else {
		res.status(200).json({ status: "success", message: "User created", data: result.value });
	}
}

export function TokenResponseHandler(res: express.Response, token: string) {
	res.status(200).json({ status: "success", message: "Token Created", data: token });
}
