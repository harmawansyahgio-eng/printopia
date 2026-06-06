const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const env = require('../config/env');

const registerUser = async (data) => {
  const { name, email, phone, password } = data;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw { statusCode: 400, message: 'Email sudah terdaftar' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'user', // Default role
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  return newUser;
};

const loginUser = async (email, password) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw { statusCode: 401, message: 'Email atau password salah' };
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { statusCode: 401, message: 'Email atau password salah' };
  }

  // Generate token
  const payload = { id: user.id, role: user.role };
  const token = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw { statusCode: 404, message: 'User tidak ditemukan' };
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
