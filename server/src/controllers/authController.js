const authService = require('../services/authService');
const { successResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    return successResponse(res, 201, 'Registrasi berhasil', user);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    return successResponse(res, 200, 'Login berhasil', data);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await authService.getProfile(userId);
    return successResponse(res, 200, 'Profil berhasil diambil', user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
