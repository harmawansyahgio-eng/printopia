const { getSettings, updateSettings } = require('../utils/settings');
const { successResponse } = require('../utils/response');

const getSettingsHandler = (req, res, next) => {
  try {
    const settings = getSettings();
    return successResponse(res, 200, 'Settings retrieved successfully', settings);
  } catch (error) {
    next(error);
  }
};

const updateSettingsHandler = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      const error = new Error('Tidak memiliki akses');
      error.statusCode = 403;
      throw error;
    }
    const updated = updateSettings(req.body);
    return successResponse(res, 200, 'Settings updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettingsHandler,
  updateSettingsHandler
};
