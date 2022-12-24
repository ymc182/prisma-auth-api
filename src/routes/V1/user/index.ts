import express from "express";

import prisma from "../../../../client";
import { TokenPayload, VerifyPassword, VerifyToken } from "../../../middlewares/auth";
import { fetchUser } from "../../../model/user";
import { generateKeyPair } from "../../../utils/crypto";
import { UserResponseHandler } from "../../../utils/httpResponse";
import { generateJwt } from "../../../controllers/generateJwt";
import { addItem, getItems } from "../../../controllers/items";
import { TOKEN_SECRET } from "../../../config";
const router = express.Router();
router.get("/:discord_id", async (req, res) => {
	const discord_id = req.params.discord_id;
	const result = await fetchUser(prisma, discord_id);
	UserResponseHandler(res, result);
});

//token verified routes
router.post("/auth_test", VerifyToken(TOKEN_SECRET), (req, res) => {
	res.status(200).json({ status: "success", message: "Authorized" });
});
router.post("/generate_keys", VerifyToken(TOKEN_SECRET), async (req, res) => {
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

//Password verified routes
router.post("/generate_jwt", VerifyPassword(prisma), generateJwt);

export default router;
