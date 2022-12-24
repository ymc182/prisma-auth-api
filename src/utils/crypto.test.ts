import { decrypt, encrypt, generateKeyPair, hashPassword } from "./crypto";

describe("crypto", () => {
	it("should generate keypair", () => {
		const { publicKey, privateKey } = generateKeyPair();
		expect(publicKey).toBeDefined();
		expect(privateKey).toBeDefined();
	});

	it("should hash password", () => {
		const password = "password";
		const hashedPassword = hashPassword(password);
		expect(hashedPassword).toBeDefined();
		expect(hashedPassword).not.toEqual(password);
		expect(hashedPassword.length).toEqual(64);
	});

	it("should encrypt and decrypt", () => {
		const { publicKey, privateKey } = generateKeyPair();
		const data = "data";
		const encrypted = encrypt(data, publicKey);
		expect(encrypted).toBeDefined();
		expect(encrypted).not.toEqual(data);
		const decrypted = decrypt(encrypted, privateKey);
		expect(decrypted).toBeDefined();
		expect(decrypted).toEqual(data);
	});
});
