'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios'; // Ensure your axios instance is configured
import { Loader2 } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  totalAmount: number;
}

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalReviews: number;
  recentOrders: Order[];
}

export default function OverviewPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // This hits your NestJS endpoint (e.g., @Get('dashboard/overview'))
        const response = await api.get('/user/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-[#f26522]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Orders" value={data?.totalOrders.toString() || '0'} />
        <Card title="Pending Orders" value={data?.pendingOrders.toString() || '0'} />
        <Card title="Delivered" value={data?.deliveredOrders.toString() || '0'} />
        <Card title="Reviews" value={data?.totalReviews.toString() || '0'} />
      </div>

{/* Recent Orders */}
<div className="bg-white p-6 rounded-xl border border-gray-200">
  <h2 className="font-semibold mb-4">Recent Orders</h2>

  <table className="w-full text-sm">
    <thead className="text-gray-500 border-b">
      <tr>
        <th className="text-left py-2">Order ID</th>
        <th className="text-left py-2">Date</th>
        <th className="text-left py-2">Status</th>
        <th className="text-left py-2">Amount</th>
      </tr>
    </thead>
    <tbody>
      {data?.recentOrders.map((order) => (
        <tr key={order.id} className="border-b last:border-0">
          <td className="py-2 font-medium">
            {/* Fallback logic: if orderNumber is null, show last 6 digits of ID */}
            #{order.orderNumber ?? order.id.slice(-6).toUpperCase()}
          </td>
          <td>
            {new Date(order.createdAt).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'short' 
            })}
          </td>
          <td className="py-2">
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
              order.status === 'DELIVERED' ? 'bg-green-50 text-green-600' : 
              order.status === 'PENDING' || order.status === 'PROCESSING' ? 'bg-orange-50 text-orange-500' : 
              'bg-gray-50 text-gray-600'
            }`}>
              {order.status}
            </span>
          </td>
          <td className="font-semibold text-gray-900">
            ₦{Number(order.totalAmount).toLocaleString()}
          </td>
        </tr>
      ))}
      {(!data?.recentOrders || data.recentOrders.length === 0) && (
        <tr>
          <td colSpan={4} className="py-8 text-center text-gray-400 italic">
            No recent orders found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}