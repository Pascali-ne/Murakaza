const { execSync } = require("child_process");
const path = require("path");

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres";
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

console.log("⚡ Generating Prisma Client...");
try {
  execSync("npx prisma generate", {
    cwd: path.resolve(__dirname, ".."),
    stdio: "inherit",
    env: process.env,
  });
  console.log("✅ Prisma Client generated successfully.");
} catch (error) {
  console.error("❌ Failed to generate Prisma Client:", error.message);
  process.exit(1);
}
