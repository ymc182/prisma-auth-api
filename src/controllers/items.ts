import { itemData } from "../types";
import express from "express";
import { TokenPayload } from "../middlewares/auth";
import prisma from "../../client";
import { createItem } from "../model/item";
import { encrypt } from "../utils/crypto";

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

export async function addItem(req: express.Request, res: express.Response) {
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

export async function updateItem(req: express.Request, res: express.Response) {
	const tokenPayload: TokenPayload = res.locals.tokenPayload as TokenPayload;
	const discord_id = tokenPayload.discord_id;
	const item_id: number = parseInt(req.params.id);
	const new_data: itemData = req.body.data;
	if (!new_data.title || !new_data.data) {
		res.status(400).json({ status: "error", message: "data and title are required" });
		return;
	}
	const item = await prisma.items.findUnique({
		where: {
			id: item_id,
		},
	});
	if (!item) {
		res.status(400).json({ status: "error", message: "Item not found" });
		return;
	}
	if (item.discord_id !== discord_id) {
		res.status(400).json({ status: "error", message: "Not Authorized" });
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
	const result = await prisma.items.update({
		where: {
			id: item_id,
		},
		data: {
			encrypted_data: encrypt(new_data.data, pubKey),
			title: new_data.title,
		},
	});
	if (!result) {
		res.status(400).json({ status: "error", message: "Failed to set data" });
		return;
	}
	res.json({ status: "success", message: "Data set", data: result });
}

export async function deleteItem(req: express.Request, res: express.Response) {
	const tokenPayload: TokenPayload = res.locals.tokenPayload as TokenPayload;
	const discord_id = tokenPayload.discord_id;
	const item_id: number = parseInt(req.params.id);
	const item = await prisma.items.findUnique({
		where: {
			id: item_id,
		},
	});
	if (!item) {
		res.status(400).json({ status: "error", message: "Item not found" });
		return;
	}
	if (item.discord_id !== discord_id) {
		res.status(400).json({ status: "error", message: "Not Authorized" });
		return;
	}
	const result = await prisma.items.delete({
		where: {
			id: item_id,
		},
	});
	if (!result) {
		res.status(400).json({ status: "error", message: "Failed to delete data" });
		return;
	}
	res.json({ status: "success", message: "Data deleted", data: result });
}
