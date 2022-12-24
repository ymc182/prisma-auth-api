import { PrismaClient } from "@prisma/client";
console.log("I initiated once");
const prisma = new PrismaClient();
export default prisma;
