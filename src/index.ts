import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import { createUser, fetchUser } from "./users/user";
import { TokenResponseHandler, UserResponseHandler } from "./helper/httpResponse";
import { VerifyPassword, generateToken, VerifyToken, TokenPayload } from "./auth/auth";
import { generateKeyPair, hashPassword } from "./helper/crypto";
import { createItem } from "./users/item";
interface itemData {
	title: string;
	data: string;
}
const prisma = new PrismaClient();
dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET!;
console.log("Init server with TOKEN_SECRET", TOKEN_SECRET);
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
	res.send(`Server Status: active , Time: ${new Date()}`);
});

//TODO: should using discord token to verify user
app.post("/register", async (req, res) => {
	if (!req.body.discord_id || !req.body.password) {
		res.status(400).json({ status: "error", message: "discord_id and password are required" });
		return;
	}
	const result = await createUser(prisma, req.body.discord_id, req.body.password);
	UserResponseHandler(res, result);
});
app.get("/user/:discord_id", async (req, res) => {
	const discord_id = req.params.discord_id;

	const result = await fetchUser(prisma, discord_id);

	UserResponseHandler(res, result);
});

//token verified routes
app.post("/user/auth_test", VerifyToken(TOKEN_SECRET), (req, res) => {
	res.status(200).json({ status: "success", message: "Authorized" });
});
app.post("/user/generate_keys", VerifyToken(TOKEN_SECRET), async (req, res) => {
	const tokenPayload: TokenPayload = res.locals.tokenPayload as TokenPayload;
	const discord_id = tokenPayload.discord_id;
	const { publicKey, privateKey } = generateKeyPair();

	await prisma.users.update({
		where: {
			discord_id: discord_id,
		},
		data: {
			public_key: publicKey,
		},
	});
	res.json({ status: "success", message: "Keys generated", privateKey: { privateKey } });
});
app.post("/user/add_item", VerifyToken(TOKEN_SECRET), async (req, res) => {
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
});
app.get("/user/get_items", VerifyToken(TOKEN_SECRET), async (req, res) => {
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
});

//Password verified routes
app.post("/user/generate_jwt", VerifyPassword(prisma), async (req, res) => {
	const discord_id = req.body.discord_id;
	const password = req.body.password;
	const token = generateToken({ discord_id: discord_id }, TOKEN_SECRET);
	TokenResponseHandler(res, token);
});
app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
app.on("close", () => {
	prisma.$disconnect();
});
app.on("error", (err) => {
	console.error(err);
	prisma.$disconnect();
});
