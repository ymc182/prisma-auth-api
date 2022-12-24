import {
	decrypt,
	encrypt,
	generateKeyPair,
	hashPassword,
	singWithPrivateKey,
	verifySignature,
} from "../src/utils/crypto";

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

	it("should sign and verify crypto message", () => {
		const { publicKey, privateKey } = generateKeyPair();
		const faultyKeyPair = generateKeyPair();
		const signature = singWithPrivateKey("this is a signature message", privateKey);
		console.log(signature);
		const result = verifySignature("this is a signature message", signature, publicKey);
		const faultyMsg = verifySignature("this is a signature message?", signature, publicKey);
		const faultySig = verifySignature(
			"this is a signature message",
			"ArpJtwPO60V0mU0ZXz7spZliDE1d2PRWCve8zFhqYpVM//XqU9MNE2l6tRG5Pmn2OF4e0DlHNWtvt3WyLMvJcQ==",
			publicKey
		);
		const faultyKey = verifySignature("this is a signature message", signature, faultyKeyPair.publicKey);
		expect(faultyMsg).toBeFalsy();
		expect(faultySig).toBeFalsy();
		expect(faultyKey).toBeFalsy();
		expect(result).toBeTruthy();
	});
});
