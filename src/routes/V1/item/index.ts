import express from "express";
import { TOKEN_SECRET } from "../../../config";
import { addItem, deleteItem, getItems, updateItem } from "../../../controllers/items";
import { VerifyToken } from "../../../middlewares/auth";
const router = express.Router();

router.post("/add_item", VerifyToken(TOKEN_SECRET), addItem);
router.get("/get_items", VerifyToken(TOKEN_SECRET), getItems);
router.patch("/update_item", VerifyToken(TOKEN_SECRET), updateItem);
router.delete("/delete_item", VerifyToken(TOKEN_SECRET), deleteItem);
export default router;
