import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import userRoutes from "./routes/V1/user";
import itemRoutes from "./routes/V1/item";
import { TOKEN_SECRET } from "./config";
import { register } from "./controllers/register";
const prisma = new PrismaClient();
dotenv.config();

console.log("Init server with TOKEN_SECRET", TOKEN_SECRET);
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
	res.send(`Server Status: active , Time: ${new Date()}`);
});

/**
 * Routes for /item
 */
app.use("/item", itemRoutes);
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
	console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
app.on("close", () => {
	prisma.$disconnect();
});
app.on("error", (err) => {
	console.error(err);
	prisma.$disconnect();
});
