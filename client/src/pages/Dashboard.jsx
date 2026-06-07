import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Printer, CheckCircle, Eye } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
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
      if (data.type === 'ORDER_STATUS_UPDATE') {
        setOrders((prev) => prev.map(o => o.id === data.order.id ? data.order : o));
      }
    };

    return () => eventSource.close();
  }, []);

  const StatusBadge = ({ status }) => {
    const variants = {
      pending: 'bg-amber-50 text-amber-600 border-amber-200',
      processing: 'bg-blue-50 text-blue-600 border-blue-200',
      ready: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      completed: 'bg-slate-50 text-slate-600 border-slate-200',
      cancelled: 'bg-red-50 text-red-600 border-red-200'
    };
    return (
      <span className={`px-2.5 py-0.5 text-xs font-medium rounded border ${variants[status] || variants.pending} capitalize`}>
        {status}
      </span>
    );
  };

  const activeCount = orders.filter(o => ['pending', 'processing'].includes(o.status)).length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      Loading dashboard...
    </div>
  );

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900">Halo, {user?.name || 'Mahasiswa'}!</h1>
          <p className="text-[15px] text-slate-500 mt-1">Siap untuk mencetak dokumen tugas kuliahmu hari ini?</p>
        </div>
        <Link 
          to="/dashboard/new" 
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Buat Order Baru</span>
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-600 mb-1">Pesanan Aktif</p>
            <h3 className="text-4xl font-bold text-slate-900">{String(activeCount).padStart(2, '0')}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Printer className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-600 mb-1">Siap Diambil</p>
            <h3 className="text-4xl font-bold text-slate-900">{String(readyCount).padStart(2, '0')}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Pesanan Saya</h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Lihat Semua History</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">ORDER ID</th>
                <th className="px-6 py-4">FILE NAME</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">TOTAL PRICE</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    Belum ada pesanan. Yuk buat order baru!
                  </td>
                </tr>
              ) : orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-blue-600">#PT-{order.id.slice(0, 5)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{order.fileName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{order.pageCount} Pages</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    Rp {order.totalPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link to={`/dashboard/orders/${order.id}`} className="inline-block text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-50">
                      <Eye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
