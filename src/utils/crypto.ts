import crypto from "crypto";

const passphrase = process.env.PASSPHRASE!;
export function hashPassword(password: string) {
	return crypto.createHash("sha256").update(password).digest("hex").toString();
}

export function generateKeyPair() {
	let keys = crypto.generateKeyPairSync("rsa", {
		modulusLength: 1024,
		publicKeyEncoding: {
			type: "spki",
			format: "der",
		},
		privateKeyEncoding: {
			type: "pkcs8",
			format: "der",
			cipher: "aes-256-cbc",
			passphrase: passphrase,
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
	//create random symmetric key
	const symmetricKey = crypto.createSecretKey(crypto.randomBytes(32));
	const iv = crypto.randomBytes(16);

	//encrypt data with symmetric key
	const cipher = crypto.createCipheriv("aes-256-cbc", symmetricKey, iv);
	let _encryptedData = cipher.update(buffer);
	_encryptedData = Buffer.concat([_encryptedData, cipher.final()]);
	//encrypt symmetric key with public key
	const encryptedIv = crypto.publicEncrypt(key, iv);
	const encryptedSymmetricKey = crypto.publicEncrypt(key, symmetricKey.export());
	//concat encrypted data and encrypted symmetric key
	const encrypted =
		_encryptedData.toString("base64") +
		":" +
		encryptedSymmetricKey.toString("base64") +
		":" +
		encryptedIv.toString("base64");
	return encrypted;
}

//decrypt
//this should be used in the client side
export function decrypt(encrypted: string, privateKey: string) {
	const key = crypto.createPrivateKey({
		key: Buffer.from(privateKey, "base64"),
		format: "der",
		type: "pkcs8",
		passphrase: passphrase,
	});
	const encryptedData = encrypted.split(":");
	const encryptedSymmetricKey = Buffer.from(encryptedData[1], "base64");
	const encryptedIv = Buffer.from(encryptedData[2], "base64");
	const symmetricKey = crypto.privateDecrypt(key, encryptedSymmetricKey);
	const iv = crypto.privateDecrypt(key, encryptedIv);
	const decipher = crypto.createDecipheriv("aes-256-cbc", symmetricKey, iv);
	let _decryptedData = decipher.update(Buffer.from(encryptedData[0], "base64"));
	_decryptedData = Buffer.concat([_decryptedData, decipher.final()]);
	return _decryptedData.toString();
}

export function singWithPrivateKey(msg: string, privateKey: string) {
	const buffer = Buffer.from(msg);
	const key = crypto.createPrivateKey({
		key: Buffer.from(privateKey, "base64"),
		format: "der",
		type: "pkcs8",
		passphrase: passphrase,
	});
	const signature = crypto.sign(null, buffer, key);
	return signature.toString("base64");
}

export function verifySignature(msg: string, signature: string, publicKey: string) {
	const buffer = Buffer.from(msg);
	const key = crypto.createPublicKey({
		key: Buffer.from(publicKey, "base64"),
		format: "der",
		type: "spki",
	});
	const verified = crypto.verify(null, buffer, key, Buffer.from(signature, "base64"));
	return verified;
}
