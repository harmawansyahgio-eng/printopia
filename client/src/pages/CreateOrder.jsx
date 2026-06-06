import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreateOrder = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState(null);
  
  const [printSpecs, setPrintSpecs] = useState({
    printType: 'bw',
    paperSize: 'A4',
    copies: 1,
    pickupMethod: 'pickup',
    deliveryAddress: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Hanya file PDF yang diperbolehkan');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadData(response.data.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Gagal upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setPrintSpecs({ ...printSpecs, [e.target.name]: e.target.value });
  };

  const calculateEstimasi = () => {
    if (!uploadData) return 0;
    
    let pricePerPage = 0;
    if (printSpecs.printType === 'bw') {
      pricePerPage = (printSpecs.paperSize === 'A3') ? 1000 : 500;
    } else {
      pricePerPage = (printSpecs.paperSize === 'A3') ? 2000 : 1000;
    }

    let total = uploadData.pageCount * pricePerPage * parseInt(printSpecs.copies);
    if (printSpecs.pickupMethod === 'delivery') {
      total += 10000;
    }
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData) return alert('Silakan upload file PDF terlebih dahulu');
    if (printSpecs.pickupMethod === 'delivery' && !printSpecs.deliveryAddress) {
      return alert('Alamat pengiriman harus diisi');
    }

    setSubmitting(true);
    try {
      await api.post('/orders', {
        fileName: uploadData.fileName,
        fileUrl: uploadData.fileUrl,
        pageCount: uploadData.pageCount,
        printType: printSpecs.printType,
        paperSize: printSpecs.paperSize,
        copies: parseInt(printSpecs.copies),
        pickupMethod: printSpecs.pickupMethod,
        deliveryAddress: printSpecs.deliveryAddress
      });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Gagal membuat order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Buat Order Print</h2>

      {/* Step 1: Upload */}
      <div className="mb-8 p-4 border border-gray-200 rounded bg-gray-50">
        <h3 className="font-semibold text-lg mb-3">1. Upload File PDF</h3>
        {!uploadData ? (
          <div className="flex items-center space-x-4">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              className="text-sm"
            />
            <button 
              onClick={handleUpload}
              disabled={!file || uploading}
              className="bg-blue-600 text-white px-4 py-1.5 rounded disabled:bg-gray-400 text-sm font-medium transition"
            >
              {uploading ? 'Mengunggah...' : 'Upload & Analisis'}
            </button>
          </div>
        ) : (
          <div className="bg-green-50 text-green-800 p-3 rounded text-sm">
            ✅ File <strong>{uploadData.fileName}</strong> berhasil diupload.
            <br/>Jumlah Halaman Terdeteksi: <strong>{uploadData.pageCount} halaman</strong>
          </div>
        )}
      </div>

      {/* Step 2: Specs */}
      {uploadData && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipe Print</label>
              <select name="printType" value={printSpecs.printType} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="bw">Hitam Putih (BW)</option>
                <option value="color">Warna</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ukuran Kertas</label>
              <select name="paperSize" value={printSpecs.paperSize} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="A4">A4</option>
                <option value="F4">F4</option>
                <option value="A3">A3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Jumlah Copy</label>
              <input 
                type="number" min="1" name="copies" 
                value={printSpecs.copies} onChange={handleChange} 
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Metode Pengambilan</label>
              <select name="pickupMethod" value={printSpecs.pickupMethod} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="pickup">Ambil Sendiri</option>
                <option value="delivery">Kirim ke Alamat (+Rp 10.000)</option>
              </select>
            </div>
          </div>

          {printSpecs.pickupMethod === 'delivery' && (
            <div>
              <label className="block text-sm font-medium mb-1">Alamat Pengiriman (Area Kampus)</label>
              <textarea 
                name="deliveryAddress" 
                value={printSpecs.deliveryAddress} 
                onChange={handleChange} 
                rows="2"
                required
                className="w-full border p-2 rounded"
              ></textarea>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
            <span className="font-semibold text-gray-700">Estimasi Total Harga:</span>
            <span className="text-2xl font-bold text-blue-700">Rp {calculateEstimasi().toLocaleString('id-ID')}</span>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {submitting ? 'Memproses Order...' : 'Konfirmasi Order'}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateOrder;
