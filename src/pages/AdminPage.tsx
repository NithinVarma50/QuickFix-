import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

const AdminPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: false });
    if (!error && data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    setDeletingId(null);
    if (!error) {
      setOrders(prev => prev.filter(order => order.id !== id)); // Optimistically remove from UI
    } else {
      fetchOrders(); // fallback in case of error
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">All Orders (Admin)</h1>
        {loading ? (
          <div>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <ul className="space-y-4">
            {orders.map(order => (
              <li key={order.id} className="border-b pb-3">
                <div className="font-medium">{order.service_type}</div>
                <div className="text-sm text-gray-600">Date: {order.booking_date?.split('T')[0]}</div>
                <div className="text-sm text-gray-600">Status: {order.status}</div>
                <div className="text-sm text-gray-600">Name: {order.name || order.user_name || '-'}</div>
                <div className="text-sm text-gray-600">Phone: {order.phone || '-'}</div>
                <div className="text-sm text-gray-600">Email: {order.email || '-'}</div>
                <div className="text-sm text-gray-600">Address: {order.address}</div>
                <div className="text-sm text-gray-600">Area: {order.area || '-'}</div>
                <div className="text-sm text-gray-600">Description: {order.description || '-'}</div>
                <Button
                  variant="destructive"
                  className="mt-2"
                  disabled={deletingId === order.id}
                  onClick={() => handleDelete(order.id)}
                >
                  {deletingId === order.id ? 'Deleting...' : 'Delete'}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
