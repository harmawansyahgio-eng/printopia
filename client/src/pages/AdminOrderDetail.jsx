import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, Download, FileText, Mail, Phone, RefreshCw, CheckCircle2, PlusCircle, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.data);
      } catch (err) {
        console.error('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    const token = localStorage.getItem('token');
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/sse/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ORDER_STATUS_UPDATE' && data.order.id === id) {
        setOrder(prev => ({ ...prev, status: data.order.status }));
      }
    };

    return () => eventSource.close();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      // In a real app we'd re-fetch to get new status logs, but for MVP updating locally is fine
    } catch (error) {
      alert('Gagal update status');
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading order details...</div>;
  if (!order) return <div className="p-8 text-slate-500">Order tidak ditemukan.</div>;

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    ready: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-slate-200 text-slate-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  const deliveryPrice = order.pickupMethod === 'delivery' ? 10000 : 0; // Or whatever calculation fits

  return (
    <div className="max-w-5xl space-y-6 pb-12">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
        <Link to="/admin" className="hover:text-blue-600 transition-colors">Orders</Link>
        <span>/</span>
        <span className="text-slate-900">#PT-{order.id.slice(0, 5)}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Order #PT-{order.id.slice(0, 5)}</h1>
          <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 transition-colors shadow-sm">
            <Printer className="w-4 h-4" /> Print Ticket
          </button>
          <a href={order.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Download File
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Document Info */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Document Information</h2>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">PDF DOCUMENT</span>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-24 h-32 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
                  <FileText className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 absolute bottom-3">PREVIEW</span>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 uppercase font-semibold">File Name</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{order.fileName}</h3>
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Pages</div>
                      <div className="text-2xl font-bold text-slate-900">{order.pageCount}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Print Type</div>
                      <div className="text-base font-semibold text-slate-700">{order.printType === 'color' ? 'Full Color' : 'Black & White'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Paper Size</div>
                      <div className="text-base font-semibold text-slate-700">{order.paperSize}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-500">Pricing Breakdown</h3>
                  <button className="text-sm font-semibold text-blue-600 hover:underline">View Policy</button>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">{order.printType === 'color' ? 'Color Print' : 'B/W Print'} ({order.pageCount} pages x {order.copies} copy)</span>
                    <span className="font-medium text-slate-900">Rp {(order.totalPrice - deliveryPrice).toLocaleString()}</span>
                  </div>
                  {deliveryPrice > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Delivery Service</span>
                      <span className="font-medium text-slate-900">Rp {deliveryPrice.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="font-bold text-slate-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">Rp {order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Status History Log</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                
                {order.statusLogs && [...order.statusLogs].reverse().map((log, index) => (
                  <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                      {log.toStatus === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                       log.toStatus === 'pending' ? <PlusCircle className="w-5 h-5" /> :
                       <RefreshCw className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                        <div className="font-bold text-slate-900 text-sm">Status changed to <span className="text-blue-600 capitalize">{log.toStatus}</span></div>
                        <div className="text-[10px] font-semibold uppercase text-slate-400 mt-1 sm:mt-0">{new Date(log.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      <div className="text-sm text-slate-600">Updated by {log.changedBy === 'system' ? 'System' : 'Admin'}</div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Update Order Status</h2>
            </div>
            <div className="p-6">
              <select 
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm font-semibold text-slate-900 mb-4 cursor-pointer"
                value={order.status}
                onChange={(e) => updateStatus(e.target.value)}
              >
                <option value="pending">Pending / Awaiting Print</option>
                <option value="processing">Processing / Printing</option>
                <option value="ready">Ready for Pickup</option>
                <option value="completed">Completed / Handed over</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Changing status will automatically notify the customer via email and WhatsApp.
              </p>
              <button 
                onClick={() => updateStatus(order.status)} // Just for show or triggering a refresh
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
              >
                Update Status
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer Details</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                  {order.user?.name?.substring(0, 2).toUpperCase() || 'US'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{order.user?.name || 'Unknown Customer'}</h3>
                  <p className="text-xs text-slate-500">Student ID: N/A</p>
                </div>
              </div>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 shrink-0">
                    <Mail className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Email Address</div>
                    <div className="text-sm font-medium text-slate-900">{order.user?.email || '-'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">WhatsApp</div>
                    <div className="text-sm font-medium text-slate-900">{order.user?.phone || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
