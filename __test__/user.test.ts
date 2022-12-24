import { prismaMock } from "../singleton";
import { fetchUser } from "../src/model/user";

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
		expect(await prismaMock.users.create({ data: user })).toEqual(user);
	});

	test("should fetch user", async () => {
		const user = {
			discord_id: "test",
			password_hash: "test",
			wallet_id: [],
			public_key: "",
			createdAt: new Date(),
		};
		prismaMock.users.findUnique.mockResolvedValue(user);

		const result = await fetchUser(prismaMock, "test");
		expect(result.ok).toBe(true);
	});
});
