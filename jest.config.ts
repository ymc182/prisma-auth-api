module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	setupFiles: ["dotenv/config"],
	testPathIgnorePatterns: ["<rootDir>/dist/", "/node_modules/"],
};
