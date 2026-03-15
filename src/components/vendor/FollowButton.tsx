"use client";

import { useState } from "react";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
  vendorId: string;
  initialIsFollowing: boolean;
}

export function FollowButton({ vendorId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggleFollow = async () => {
    setLoading(true);
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    const action = isFollowing ? 'unfollow' : 'follow';
    const method = isFollowing ? 'DELETE' : 'POST';

    try {
      // Assuming you store your JWT in a cookie or local storage
      const token = localStorage.getItem('token'); 
      
      const res = await fetch(`${apiBase}/vendor/${vendorId}/${action}`, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 401) {
        // Redirect to login if not authenticated
        router.push('/login');
        return;
      }

      if (res.ok) {
        setIsFollowing(!isFollowing);
        router.refresh(); // Refresh server data (follower count)
      }
    } catch (error) {
      console.error("Follow_Action_Failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggleFollow}
      disabled={loading}
      className={`
        flex items-center gap-2 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95
        ${isFollowing 
          ? 'bg-zinc-800 text-white hover:bg-red-600' 
          : 'bg-white text-black hover:bg-zinc-100'}
        ${loading ? 'opacity-70 cursor-not-allowed' : ''}
      `}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isFollowing ? (
        <><UserMinus size={14} /> Unfollow_Store</>
      ) : (
        <><UserPlus size={14} /> Follow_Store</>
      )}
    </button>
  );
}