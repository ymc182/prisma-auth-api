import { Users } from "@prisma/client";
import express from "express";
import { UserData } from "../types";
import { PrismaResult } from "../types/errors";
export function UserResponseHandler(res: express.Response, result: PrismaResult<UserData, Error>) {
	if (!result.ok) {
		res.status(400).json({ status: "error", message: result.error.message });
	} else {
		res.status(200).json({ status: "success", message: "User Details", data: result.value });
	}
}

export function TokenResponseHandler(res: express.Response, token: string) {
	res.status(200).json({ status: "success", message: "JWT Token Details", data: token });
}
