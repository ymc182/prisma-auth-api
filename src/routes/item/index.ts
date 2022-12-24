import { itemData } from "./../../types/index.d";
import express from "express";
import { TokenPayload } from "../../auth/auth";
import prisma from "../../../client";
import { createItem } from "../../users/item";

export async function getItems(req: express.Request, res: express.Response) {
	const tokenPayload: TokenPayload = res.locals.tokenPayload as TokenPayload;
	const discord_id = tokenPayload.discord_id;
	const items = await prisma.items.findMany({
		where: {
			discord_id: discord_id,
		},
	});
	if (!items) {
		res.status(400).json({ status: "error", message: "User not found" });
		return;
	}
	res.json({ status: "success", message: "Items fetched", items: items });
}

export async function createItemApi(req: express.Request, res: express.Response) {
	const tokenPayload: TokenPayload = res.locals.tokenPayload as TokenPayload;
	const discord_id = tokenPayload.discord_id;
	let newData: itemData = req.body.data;
	if (!newData.title || !newData.data) {
		res.status(400).json({ status: "error", message: "data and title are required" });
		return;
	}
	const user = await prisma.users.findUnique({
		where: {
			discord_id: discord_id,
		},
	});
	if (!user) {
		res.status(400).json({ status: "error", message: "User not found" });
		return;
	}
	const pubKey = user.public_key;
	if (!pubKey) {
		res.status(400).json({ status: "error", message: "User has no public key" });
		return;
	}
	const result = await createItem(prisma, discord_id, newData.data, newData.title, pubKey);
	if (!result) {
		res.status(400).json({ status: "error", message: "Failed to set data" });
		return;
	}

	res.json({ status: "success", message: "Data set", data: result });
}
