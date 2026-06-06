const documentService = require('../services/documentService');
const { successResponse } = require('../utils/response');

const uploadPdf = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: 'Silakan upload file PDF' });
    }

    const data = await documentService.processAndUploadPdf(file);
    return successResponse(res, 200, 'File berhasil diproses', data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadPdf
};
