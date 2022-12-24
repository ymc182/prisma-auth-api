import { PrismaResult } from "../types/errors";
import { PrismaClient, Users } from "@prisma/client";
import { hashPassword } from "../utils/crypto";
import { UserData } from "../types";

export async function createUser(
	prisma: PrismaClient,
	discord_id: string,
	password: string
): Promise<PrismaResult<Users, Error>> {
	const hashedPassword = hashPassword(password);

	const user = await prisma.users.create({
		data: {
			discord_id: discord_id,
			password_hash: hashedPassword,
		},
	});
	if (!user) {
		return { ok: false, error: new Error("User not created") };
	}
	return { ok: true, value: user };
}

export async function fetchUser(prisma: PrismaClient, discord_id: string): Promise<PrismaResult<UserData, Error>> {
	const user = await prisma.users.findUnique({
		where: {
			discord_id: discord_id,
		},
	});
	if (!user) {
		return { ok: false, error: new Error("User not found") };
	}
	return { ok: true, value: user };
}
