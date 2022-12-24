import crypto from "crypto";

const passphrase = process.env.PASSPHRASE!;
export function hashPassword(password: string) {
	return crypto.createHash("sha256").update(password).digest("hex").toString();
}

//create keypair
export function generateKeyPair() {
	//generate keypair and return as string
	let keys = crypto.generateKeyPairSync("rsa", {
		modulusLength: 512,
		publicKeyEncoding: {
			type: "spki",
			format: "der",
		},
		privateKeyEncoding: {
			type: "pkcs8",
			format: "der",
		},
	});
	const publicKey = keys.publicKey.toString("base64");
	const privateKey = keys.privateKey.toString("base64");
	return { publicKey, privateKey };
}

//encrypt
export function encrypt(data: string, publicKey: string) {
	//encrypt with der format public key
	const buffer = Buffer.from(data);
	const key = crypto.createPublicKey({
		key: Buffer.from(publicKey, "base64"),
		format: "der",
		type: "spki",
	});
	const encrypted = crypto.publicEncrypt(key, buffer);
	return encrypted.toString("base64");
}

//decrypt
//this should be used in the client side
export function decrypt(encrypted: string, privateKey: string) {
	//decrypt with der format private key
	const buffer = Buffer.from(encrypted, "base64");
	const key = crypto.createPrivateKey({
		key: Buffer.from(privateKey, "base64"),
		format: "der",
		type: "pkcs8",
		/* 		passphrase: passphrase, */
	});
	const decrypted = crypto.privateDecrypt(key, buffer);
	return decrypted.toString();
}
