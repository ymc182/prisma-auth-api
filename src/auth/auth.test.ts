import { Users } from "@prisma/client";
import { generateToken, VerifyPassword, VerifyToken } from "./auth";
import { prismaMock } from "../../singleton";
import { hashPassword } from "../helper/crypto";
describe("Auth", () => {
	const user: Users = {
		discord_id: "test",
		password_hash: hashPassword("test"),
		wallet_id: [],
		public_key: "",
		createdAt: new Date(),
	};
	test("Should generate token", async () => {
		const token = generateToken({ discord_id: "test" }, "test");
		expect(token).toHaveLength(155);
	});

	test("should verify token", async () => {
		const token = generateToken({ discord_id: "test" }, "test");
		const req: any = {
			headers: {
				authorization: `Bearer ${token}`,
			},
			body: {
				tokenPayload: {
					discord_id: "test",
				},
			},
		};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
			locals: {},
		};
		const next = jest.fn();
		await VerifyToken("test")(req, res, next);
		expect(next).toHaveBeenCalled();
	});

	test("should not verify wrong token", async () => {
		const req: any = {
			headers: {
				authorization: `Bearer ${"wrong_token"}`,
			},
			body: {
				tokenPayload: {
					discord_id: "test",
				},
			},
		};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
			locals: {},
		};
		const next = jest.fn();
		await VerifyToken("test")(req, res, next);
		expect(next).not.toHaveBeenCalled();
	});

	test("should not verify token without authorization header", async () => {
		const req: any = {
			headers: {},
			body: {
				tokenPayload: {
					discord_id: "test",
				},
			},
		};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
			locals: {},
		};
		const next = jest.fn();
		await VerifyToken("test")(req, res, next);
		expect(next).not.toHaveBeenCalled();
	});

	test("should verify password", async () => {
		const req: any = {
			body: {
				discord_id: "test",
				password: "test",
			},
		};
		const res: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
			locals: {},
		};
		const next = jest.fn();
		prismaMock.users.findUnique.mockResolvedValue(user);
		const result = await prismaMock.users.findUnique({ where: { discord_id: "test" } });
		const vResult = await VerifyPassword(prismaMock)(req, res, next);
		expect(next).toHaveBeenCalled();
	});
});
