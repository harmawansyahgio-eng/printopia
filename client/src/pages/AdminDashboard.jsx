import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock, Hourglass, BarChart3, Filter, Download, AlignLeft, Info } from 'lucide-react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.data);
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    const token = localStorage.getItem('token');
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/sse/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_ORDER' || data.type === 'ORDER_STATUS_UPDATE') {
        fetchOrders();
      }
    };

    return () => eventSource.close();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      alert('Gagal update status');
    }
  };

  const StatusSelect = ({ order }) => {
    const styleMap = {
      pending: 'text-amber-600 border-amber-200 bg-amber-50/50',
      processing: 'text-blue-600 border-blue-200 bg-blue-50/50',
      ready: 'text-emerald-600 border-emerald-200 bg-emerald-50/50',
      completed: 'text-slate-600 border-slate-200 bg-slate-50/50',
      cancelled: 'text-red-600 border-red-200 bg-red-50/50'
    };
    
    return (
      <select 
        className={`px-3 py-1 text-xs font-semibold rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none text-center ${styleMap[order.status]}`}
        value={order.status}
        onChange={(e) => updateStatus(order.id, e.target.value)}
      >
        <option value="pending" className="text-slate-900 bg-white">Pending</option>
        <option value="processing" className="text-slate-900 bg-white">Processing</option>
        <option value="ready" className="text-slate-900 bg-white">Ready</option>
        <option value="completed" className="text-slate-900 bg-white">Completed</option>
        <option value="cancelled" className="text-slate-900 bg-white">Cancelled</option>
      </select>
    );
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      Loading dashboard...
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Semua Pesanan</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola dan pantau seluruh antrean cetak mahasiswa.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Total Pesanan</p>
            <h3 className="text-3xl font-bold text-slate-900">{orders.length}</h3>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Menunggu</p>
            <h3 className="text-3xl font-bold text-slate-900">{pendingCount}</h3>
            <p className="text-xs text-slate-500 mt-2">Butuh tindakan segera</p>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2">Sedang Diproses</p>
            <h3 className="text-3xl font-bold text-slate-900">{processingCount}</h3>
            <p className="text-xs text-slate-500 mt-2">Dalam antrean mesin</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center">
            <Hourglass className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h2 className="text-base font-bold text-slate-900">Antrean Pesanan</h2>
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1">
            <button className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded shadow-sm">Aktif</button>
            <button className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">Selesai</button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">ID PESANAN</th>
                <th className="px-6 py-4">PELANGGAN</th>
                <th className="px-6 py-4">NAMA FILE</th>
                <th className="px-6 py-4">TIPE</th>
                <th className="px-6 py-4 text-center">STATUS</th>
                <th className="px-6 py-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-blue-600 text-xs">#PRT-{order.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{order.user?.name}</div>
                    <div className="text-xs text-slate-500">{order.user?.email || 'Sistem Informasi'}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {order.fileName}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${order.printType === 'color' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {order.printType === 'color' ? 'Color' : 'BW'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusSelect order={order} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-blue-600 hover:text-blue-700"><AlignLeft className="w-4 h-4" /></button>
                      <Link to={`/admin/orders/${order.id}`} className="text-slate-400 hover:text-slate-600">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-sm text-slate-500">
          <div>Menampilkan 1-{Math.min(orders.length, 10)} dari {orders.length} pesanan</div>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-400">&lt;</button>
            <button className="w-8 h-8 flex items-center justify-center border border-blue-600 rounded-md bg-blue-600 text-white font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-md bg-white hover:bg-slate-50 font-medium text-slate-700">2</button>
            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-md bg-white hover:bg-slate-50 font-medium text-slate-700">3</button>
            <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-600">&gt;</button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 flex gap-4 mt-8">
        <div className="mt-0.5">
          <Info className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 mb-1">Tips Operasional</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            Gunakan status 'Ready' untuk memberitahu mahasiswa melalui notifikasi aplikasi bahwa dokumen mereka sudah siap diambil di meja kasir. Hal ini dapat mengurangi antrean fisik di area tunggu.
          </p>
        </div>
      </div>
    </div>
  );
}
