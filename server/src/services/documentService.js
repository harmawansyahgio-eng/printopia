const pdfParse = require('pdf-parse');
const supabase = require('../config/supabase');
const env = require('../config/env');

const processAndUploadPdf = async (file) => {
  if (!file) {
    const error = new Error('File tidak ditemukan');
    error.statusCode = 400;
    throw error;
  }

  // Parse PDF for get count page
  let pageCount = 0;
  console.log('File metadata:', {
    originalname: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
  });
  try {
    const data = await pdfParse(file.buffer);
    pageCount = data.numpages;
  } catch (err) {
    console.error('PDF Parse Error:', err);
    const error = new Error('Gagal membaca file PDF, pastikan file tidak rusak');
    error.statusCode = 400;
    throw error;
  }

  // 0Upload to Supabase Storage
  const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(env.supabaseBucket || 'documents')
    .upload(`uploads/${fileName}`, file.buffer, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (uploadError) {
    console.error('Supabase Upload Error:', uploadError);
    const error = new Error('Gagal mengupload file ke storage');
    error.statusCode = 500;
    throw error;
  }

  // get public url
  const { data: publicUrlData } = supabase.storage
    .from(env.supabaseBucket || 'documents')
    .getPublicUrl(`uploads/${fileName}`);

  return {
    fileName: file.originalname,
    storedFileName: fileName,
    fileUrl: publicUrlData.publicUrl,
    pageCount: pageCount,
    size: file.size,
  };
};

module.exports = {
  processAndUploadPdf,
};
