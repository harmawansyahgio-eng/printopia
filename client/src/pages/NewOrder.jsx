import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, Receipt, Store, Truck, Info, ArrowRight } from 'lucide-react';
import api from '../api/axios';

const DEFAULT_PRICING = {
  paper: {
    A4: { label: 'A4 (Standard)', basePrice: 500 },
    F4: { label: 'F4 (Folio)', basePrice: 600 },
    A3: { label: 'A3 (Large)', basePrice: 1000 },
  },
  color: {
    bw: { label: 'Hitam Putih (Rp 500/hal)', multiplier: 1 },
    color: { label: 'Warna (Rp 1500/hal)', multiplier: 3 },
  },
  delivery: {
    pickup: { label: 'Pickup', price: 0 },
    delivery: { label: 'Delivery', price: 10000 },
  },
};

export default function NewOrder() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [pricing, setPricing] = useState(DEFAULT_PRICING);

  useEffect(() => {
    api
      .get('/settings')
      .then((res) => {
        if (res.data && res.data.data) {
          setPricing(res.data.data);
        }
      })
      .catch((err) => console.error('Failed to load pricing settings'));
  }, []);

  const [config, setConfig] = useState({
    paperSize: 'A4',
    printType: 'bw',
    copies: 1,
    pickupMethod: 'pickup',
    deliveryAddress: '',
  });

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Invalid file type. Only PDF is allowed.');
      return;
    }
    setFile(selectedFile);
    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFileMeta(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal upload file');
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const updateConfig = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!fileMeta) return;
    setIsSubmitting(true);
    try {
      await api.post('/orders', {
        fileName: fileMeta.fileName,
        fileUrl: fileMeta.fileUrl,
        pageCount: fileMeta.pageCount,
        printType: config.printType,
        paperSize: config.paperSize,
        copies: config.copies,
        pickupMethod: config.pickupMethod,
        deliveryAddress: config.pickupMethod === 'delivery' ? config.deliveryAddress : null,
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Gagal membuat order');
      setIsSubmitting(false);
    }
  };

  const isReady = fileMeta && !isUploading && !isSubmitting && !error;

  let baseCost =
    (pricing?.paper?.[config.paperSize]?.basePrice || 500) *
    (pricing?.color?.[config.printType]?.multiplier || 1);
  let documentCost = 0;
  if (fileMeta) {
    documentCost = fileMeta.pageCount * baseCost;
  }
  const subtotal = documentCost * config.copies;
  const shippingFee = pricing?.delivery?.[config.pickupMethod]?.price || 0;
  const total = subtotal + shippingFee;

  return (
    <div className="py-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create New Print Order</h1>
        <p className="text-[15px] text-slate-500 mt-2">
          Fill in your document details and preferences for high-quality printing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-sm font-bold text-white">
                1
              </span>
              File Upload
            </h2>

            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 py-16 px-6 text-center rounded-xl cursor-pointer transition-colors group"
              >
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <FileUp className="w-7 h-7" />
                </div>
                <p className="text-base font-semibold text-slate-900 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-slate-500">PDF documents only (Max 50MB)</p>
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="border border-slate-200 p-5 bg-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 line-clamp-1">
                      {file.name}
                    </div>
                    <div className="text-xs font-medium mt-1">
                      {isUploading ? (
                        <span className="text-amber-600">Analyzing document...</span>
                      ) : (
                        <span className="text-emerald-600">
                          {fileMeta?.pageCount || 0} Pages detected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {!isUploading && (
                  <button
                    onClick={() => {
                      setFile(null);
                      setFileMeta(null);
                    }}
                    className="text-sm font-medium px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Change File
                  </button>
                )}
              </div>
            )}
            {error && file && (
              <div className="mt-4 text-red-600 text-sm font-medium flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}
          </div>

          {/* Card 2 */}
          <div
            className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm transition-opacity duration-300 ${!fileMeta || isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-sm font-bold text-white">
                2
              </span>
              Print Options
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Print Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-sm"
                  value={config.printType}
                  onChange={(e) => updateConfig('printType', e.target.value)}
                >
                  {pricing?.color ? (
                    Object.entries(pricing.color).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))
                  ) : (
                    <option value="bw">Hitam Putih</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Paper Size
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-sm"
                  value={config.paperSize}
                  onChange={(e) => updateConfig('paperSize', e.target.value)}
                >
                  {pricing?.paper ? (
                    Object.entries(pricing.paper).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))
                  ) : (
                    <option value="A4">A4</option>
                  )}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Number of Copies
                </label>
                <div className="flex items-center w-32 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => updateConfig('copies', Math.max(1, config.copies - 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="flex-1 h-10 text-center text-sm font-semibold bg-white border-x border-slate-200 outline-none appearance-none"
                    value={config.copies}
                    onChange={(e) =>
                      updateConfig('copies', Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => updateConfig('copies', config.copies + 1)}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm transition-opacity duration-300 ${!fileMeta || isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-sm font-bold text-white">
                3
              </span>
              Distribution
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => updateConfig('pickupMethod', 'pickup')}
                className={`border rounded-xl p-4 cursor-pointer transition-all flex items-start gap-3 ${config.pickupMethod === 'pickup' ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
              >
                <div className="mt-1">
                  <Store
                    className={`w-5 h-5 ${config.pickupMethod === 'pickup' ? 'text-blue-600' : 'text-slate-400'}`}
                  />
                </div>
                <div>
                  <h3
                    className={`font-bold ${config.pickupMethod === 'pickup' ? 'text-slate-900' : 'text-slate-700'}`}
                  >
                    Pickup
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Ambil di tempat</p>
                </div>
              </div>

              <div
                onClick={() => updateConfig('pickupMethod', 'delivery')}
                className={`border rounded-xl p-4 cursor-pointer transition-all flex items-start gap-3 ${config.pickupMethod === 'delivery' ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
              >
                <div className="mt-1">
                  <Truck
                    className={`w-5 h-5 ${config.pickupMethod === 'delivery' ? 'text-blue-600' : 'text-slate-400'}`}
                  />
                </div>
                <div>
                  <h3
                    className={`font-bold ${config.pickupMethod === 'delivery' ? 'text-slate-900' : 'text-slate-700'}`}
                  >
                    Delivery
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Kirim Hanya dalam area kampus</p>
                </div>
              </div>
            </div>

            {config.pickupMethod === 'delivery' && (
              <div className="mt-4">
                <textarea
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all shadow-sm resize-none h-24"
                  value={config.deliveryAddress}
                  onChange={(e) => updateConfig('deliveryAddress', e.target.value)}
                  placeholder="Detail Alamat Pengiriman (Nama Gedung, Ruangan, dsb)"
                  required
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-slate-700" />
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 text-sm">Document Cost</span>
                <div className="text-right">
                  <div className="text-xs text-slate-400 mb-1">
                    {fileMeta?.pageCount || 0} Hal x {config.copies} Copy
                  </div>
                  <div className="text-xs text-slate-400">@ Rp {baseCost}</div>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-y border-slate-100">
                <span className="text-slate-500 text-sm">Subtotal</span>
                <span className="font-bold text-slate-900 text-sm">
                  Rp {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Shipping/Service</span>
                <span className="font-semibold text-emerald-600 text-sm">
                  {shippingFee === 0 ? 'Free (Pickup)' : `Rp ${shippingFee.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-900 font-bold">Total Tagihan</span>
                <span className="text-2xl font-bold text-blue-600 tracking-tight">
                  Rp {total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              disabled={!isReady || (config.pickupMethod === 'delivery' && !config.deliveryAddress)}
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold py-3.5 px-4 rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Processing Order...' : 'Konfirmasi & Buat Order'}
              {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </button>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 text-center mt-4 mb-8"></p>

            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm">Estimasi pengerjaan: 15-30 menit.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="pt-20 pb-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-200">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Printopia</h3>
          <p className="text-sm text-slate-500">
            © 2024 Printopia. Efficiency for Academic Success.
          </p>
        </div>
        <div className="flex gap-6 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-slate-900 transition-colors">
            Support
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-slate-900 transition-colors">
            Campus Locations
          </a>
        </div>
      </footer>
    </div>
  );
}
