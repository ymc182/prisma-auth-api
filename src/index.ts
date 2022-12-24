import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import { createUser } from "./model/user";
import { UserResponseHandler } from "./utils/httpResponse";
import userRoutes from "./routes/V1/user";
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

/**
 * Routes for /user
 */
app.use("/user", userRoutes);

/**
 *
 *
 *
 */
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
