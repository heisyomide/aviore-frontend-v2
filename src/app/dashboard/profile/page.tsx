'use client';

import { useState, useEffect } from 'react';
import { api } from '@/src/lib/axios';
import { Loader2, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProfileInfoCard from '../../../components/dashboard/ProfileInfoCard';
import EditProfileModal from '../../../components/dashboard/EditProfileModal'; // Create this component

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/profile');
      setUser(response.data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-orange-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

      {/* Profile Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.name || 'Guest User'}
            </h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Details List */}
      <div className="bg-white px-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <ProfileInfoCard 
          label="Full Name" 
          value={user?.name || "Not provided"} 
        />
        <ProfileInfoCard 
          label="Phone Number" 
          value={user?.phone || "+234 --- --- ----"} 
        />
        <ProfileInfoCard 
          label="Total Orders" 
          value={user?._count?.orders?.toString() || "0"} 
        />
        <ProfileInfoCard 
          label="Total Reviews" 
          value={user?._count?.reviews?.toString() || "0"} 
        />
      </div>

      {/* Action Button */}
      <button 
        onClick={() => setIsEditModalOpen(true)}
        className="bg-[#f26522] text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold shadow-md"
      >
        Edit Profile
      </button>

      {/* Modal for actual database updates */}
      <EditProfileModal 
        user={user} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onUpdate={fetchProfile}
      />
    </div>
  );
}