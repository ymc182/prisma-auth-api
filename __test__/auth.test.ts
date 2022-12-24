import { generateToken, VerifyToken } from "../src/middlewares/auth";

describe("Auth", () => {
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
});
