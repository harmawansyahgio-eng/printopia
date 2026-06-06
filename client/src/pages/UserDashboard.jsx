import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();

    const token = localStorage.getItem('token');
    let sse;

    if (token) {
      // Connect to SSE
      sse = new EventSource(`http://localhost:5000/api/sse/stream?token=${token}`);
      
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'ORDER_STATUS_UPDATE') {
          // Update orders list with the new status
          setOrders((prevOrders) => 
            prevOrders.map(order => 
              order.id === data.order.id ? { ...order, status: data.order.status } : order
            )
          );
        }
      };
    }

    return () => {
      if (sse) sse.close();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Anda</h2>
        <Link 
          to="/order/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition font-medium"
        >
          + Buat Order Print
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500 mb-4">Anda belum memiliki order print.</p>
          <Link to="/order/new" className="text-blue-600 hover:underline">Mulai sekarang</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-3 text-sm font-medium text-gray-600">ID Order</th>
                <th className="p-3 text-sm font-medium text-gray-600">File</th>
                <th className="p-3 text-sm font-medium text-gray-600">Tgl Order</th>
                <th className="p-3 text-sm font-medium text-gray-600">Total Harga</th>
                <th className="p-3 text-sm font-medium text-gray-600">Status</th>
                <th className="p-3 text-sm font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm font-mono text-gray-600">{order.id.substring(0, 8)}...</td>
                  <td className="p-3 text-sm">
                    <div className="max-w-[150px] truncate" title={order.fileName}>
                      {order.fileName}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-3 text-sm font-medium">
                    Rp {order.totalPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="p-3">
                    <a 
                      href={order.fileUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Lihat File
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
