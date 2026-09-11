// Prisma client singleton — avoids exhausting Neon's connection pool
// when the process is recycled between requests (Render web services
// stay warm, but this guards against dev hot-reload too).
const { PrismaClient } = require("@prisma/client");

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ["error", "warn"] : ["error", "warn", "query"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
