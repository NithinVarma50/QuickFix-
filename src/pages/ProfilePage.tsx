
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { 
  User, 
  LogOut, 
  Calendar, 
  Clock,
  Trash2,
  Settings,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfilePage: React.FC = () => {
  const { user, login, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  // Add delete order functionality for user with proper loading state
  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    setDeleteLoading(id); // Set loading for specific order
    
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      
      if (!error) {
        setOrders(prev => prev.filter(order => order.id !== id));
        toast({
          title: "Order deleted",
          description: "Your order has been successfully removed",
        });
      } else {
        throw error;
      }
    } catch (error) {
      toast({
        title: "Error deleting order",
        description: "There was a problem deleting your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const refreshOrders = async () => {
    if (!user) return;
    
    setRefreshing(true);
    await fetchOrders(user.id);
    setRefreshing(false);
    
    toast({
      title: "Refreshed",
      description: "Your order list has been updated",
    });
  };

  const fetchOrders = async (userId: string) => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('booking_date', { ascending: false });
        
      if (!error && data) {
        setOrders(data);
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error loading orders",
        description: "There was a problem loading your orders. Please refresh the page.",
        variant: "destructive"
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!user && !loading) {
      login();
    }
    if (user) {
      fetchOrders(user.id);
    }

    // Setup real-time listener for booking changes
    if (user) {
      const channel = supabase
        .channel('public:bookings')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'bookings',
            filter: `user_id=eq.${user.id}`
          }, 
          (payload) => {
            // Refresh the orders when any changes happen
            fetchOrders(user.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, login, loading]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-quickfix-blue border-quickfix-orange border-opacity-50 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
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

  const getStatusBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status || 'Processing'}</Badge>;
    }
  };

  const getInitials = () => {
    const firstName = user.user_metadata?.first_name || '';
    const lastName = user.user_metadata?.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Information */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Personal Information</CardTitle>
            <CardDescription>Your account details and preferences</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-quickfix-blue text-white text-xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold">
                {user.user_metadata?.first_name || ''} {user.user_metadata?.last_name || ''}
              </h2>
              <p className="text-gray-500 mb-2">{user.email}</p>
              
              <Badge className="bg-quickfix-blue">Verified Customer</Badge>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-gray-600">{user.user_metadata?.first_name || '-'} {user.user_metadata?.last_name || ''}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-gray-600">{new Date(user.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 pt-2">
            <Button 
              className="w-full flex items-center justify-center gap-2" 
              variant="outline"
            >
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
            
            <Button
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600"
              onClick={async () => { await signOut(); navigate('/'); }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </CardFooter>
        </Card>

        {/* Service History */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Service History</CardTitle>
              <CardDescription>Your recent appointments and bookings</CardDescription>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={refreshOrders}
              disabled={refreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardHeader>
          
          <CardContent>
            {ordersLoading ? (
              <div className="py-8 text-center">
                <div className="w-8 h-8 border-2 border-t-quickfix-blue border-quickfix-light-blue rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500">Loading your service history...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center border rounded-md bg-gray-50">
                <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-900">No service history</h3>
                <p className="mt-1 text-gray-500">You haven't booked any services yet.</p>
                <Button className="mt-4 bg-quickfix-blue hover:bg-quickfix-blue/90" asChild>
                  <Link to="/booking">Book a Service</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.service_type}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            {order.booking_date?.split('T')[0]}
                          </div>
                          {order.booking_time && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {order.booking_time}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deleteLoading === order.id}
                            className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            {deleteLoading === order.id ? (
                              <div className="h-4 w-4 border-2 border-t-red-500 border-red-200 rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          
          {orders.length > 0 && (
            <CardFooter className="flex justify-between border-t pt-4">
              <p className="text-sm text-gray-500">
                Showing {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </p>
              <Link to="/booking" className="text-quickfix-blue hover:underline text-sm font-medium">
                Book New Service
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
