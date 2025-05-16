import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage: React.FC = () => {
  const { user, login, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      login();
    }
    if (user) {
      setOrdersLoading(true);
      supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) setOrders(data);
          setOrdersLoading(false);
        });
    }
  }, [user, login, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please <Link to="/auth" className="underline font-medium">login or register</Link> to access your profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4">
          <div className="font-semibold text-lg">Name:</div>
          <div>{user.user_metadata?.first_name || "-"} {user.user_metadata?.last_name || ""}</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-lg">Email:</div>
          <div>{user.email}</div>
        </div>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4"
          onClick={async () => { await signOut(); navigate('/'); }}
        >
          Logout
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
        {ordersLoading ? (
          <div>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div>No orders found.</div>
        ) : (
          <ul className="space-y-2">
            {orders.map(order => (
              <li key={order.id} className="border-b pb-2">
                <div className="font-medium">{order.service_type}</div>
                <div className="text-sm text-gray-600">Date: {order.booking_date?.split('T')[0]}</div>
                <div className="text-sm text-gray-600">Status: {order.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

