import { Items, PrismaClient, Users } from "@prisma/client";
import { encrypt } from "../helper/crypto";

export async function createItem(
	prisma: PrismaClient,
	discord_id: string,
	data: string,
	title: string,
	publicKey: string
) {
	const result = prisma.items.create({
		data: {
			discord_id: discord_id,
			encrypted_data: encrypt(data, publicKey),
			title: title,
		},
	});
	return result;
}

export async function fetchItemById(prisma: PrismaClient, discord_id: string) {
	const result = prisma.items.findMany({
		where: {
			discord_id: discord_id,
		},
	});
	return result;
}
