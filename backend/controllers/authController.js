const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const prisma = require("../config/db");

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  fullName: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, type: "refresh" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d" }
  );
}

// POST /api/auth/register — always creates a USER; ADMIN accounts are
// provisioned directly in the database or promoted by an existing admin.
async function register(req, res, next) {
  try {
    const { email, password, fullName } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, fullName, role: "USER" },
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.status(201).json({
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.json({
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/refresh
async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "refreshToken is required." });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (payload.type !== "refresh") {
      return res.status(401).json({ error: "Invalid refresh token." });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Account not found or disabled." });
    }

    res.json({ accessToken: signAccessToken(user) });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired refresh token." });
  }
}

// GET /api/auth/me
async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found." });

    res.json({ id: user.id, email: user.email, fullName: user.fullName, role: user.role });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, refresh, me };
