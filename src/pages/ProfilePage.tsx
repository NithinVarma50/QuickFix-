import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Redirect to login if not authenticated
      login();
    }
  }, [user, login]);

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <p>Welcome, {user.name}! Here you can manage your account details.</p>
    </div>
  );
};

export default ProfilePage;
