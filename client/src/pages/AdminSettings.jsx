import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import api from '../api/axios';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then(res => {
        setSettings(res.data.data);
      })
      .catch(err => alert('Gagal memuat settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings);
      alert('Pengaturan harga berhasil disimpan!');
    } catch (error) {
      alert('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (category, key, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: {
          ...prev[category][key],
          [field]: parseFloat(value) || 0
        }
      }
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (!settings) return <div>Error loading settings.</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pengaturan Harga</h1>
        <p className="text-sm text-slate-500 mt-1">Konfigurasi biaya dasar, tarif warna, dan ongkos kirim.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-8">
        {/* Paper Size Prices */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Harga Dasar Kertas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(settings.paper).map(key => (
              <div key={key}>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{settings.paper[key].label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Rp</span>
                  <input 
                    type="number"
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    value={settings.paper[key].basePrice}
                    onChange={(e) => updateSetting('paper', key, 'basePrice', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Multiplier */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Pengganda Warna (Multiplier)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(settings.color).map(key => (
              <div key={key}>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{settings.color[key].label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">x</span>
                  <input 
                    type="number" step="0.1"
                    className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    value={settings.color[key].multiplier}
                    onChange={(e) => updateSetting('color', key, 'multiplier', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Prices */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Biaya Pengiriman</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(settings.delivery).map(key => (
              <div key={key}>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{settings.delivery[key].label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Rp</span>
                  <input 
                    type="number"
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    value={settings.delivery[key].price}
                    onChange={(e) => updateSetting('delivery', key, 'price', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            disabled={saving}
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </div>
    </div>
  );
}
