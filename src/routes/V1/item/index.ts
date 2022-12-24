import express from "express";
import { TOKEN_SECRET } from "../../../config";
import { addItem, getItems } from "../../../controllers/items";
import { VerifyToken } from "../../../middlewares/auth";
const router = express.Router();

router.post("/add_item", VerifyToken(TOKEN_SECRET), addItem);
router.get("/get_items", VerifyToken(TOKEN_SECRET), getItems);

export default router;
