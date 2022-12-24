import { prismaMock } from "../singleton";

describe("User", () => {
	test("should create new user", async () => {
		const user = {
			discord_id: "test",
			password_hash: "test",
			wallet_id: [],
			public_key: "",
			createdAt: new Date(),
		};
		prismaMock.users.create.mockResolvedValue(user);
	});
});
