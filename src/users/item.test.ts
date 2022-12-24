import { PrismaResult } from "./../types/errors.d";
import { Items, PrismaClient, Users } from "@prisma/client";
describe("Item", () => {
	const item: Items = {
		id: 1,
		discord_id: "123456789",
		encrypted_data: "test",
		title: "test",
		createdAt: new Date(),
	};
	const prismaMock = {
		items: {
			create: jest.fn(),
			findMany: jest.fn(),
		},
	};
	test("should create new item", async () => {
		prismaMock.items.create.mockResolvedValue(item);
		const result = await prismaMock.items.create(item);
		expect(result).toEqual(item);
	});

	test("should fetch item by id", async () => {
		prismaMock.items.findMany.mockResolvedValue([item]);
		const result = await prismaMock.items.findMany({ where: { discord_id: "123456789" } });
		expect(result).toEqual([item]);
	});
});
