import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import { createUser, fetchUser } from "./model/user";
import { TokenResponseHandler, UserResponseHandler } from "./utils/httpResponse";
import { VerifyPassword, generateToken, VerifyToken, TokenPayload } from "./middlewares/auth";
import { generateKeyPair, hashPassword } from "./utils/crypto";
import { createItem } from "./model/item";
import { generateJwt } from "./routes/password";
import { createItemApi, getItems } from "./routes/tokens/item";

const prisma = new PrismaClient();
dotenv.config();
export const TOKEN_SECRET = process.env.TOKEN_SECRET!;
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
app.post("/user/add_item", VerifyToken(TOKEN_SECRET), createItemApi);
app.get("/user/get_items", VerifyToken(TOKEN_SECRET), getItems);

//Password verified routes
app.post("/user/generate_jwt", VerifyPassword(prisma), generateJwt);

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
