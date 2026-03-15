"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  UserX, 
  UserCheck, 
  Users,
  Activity,
  Terminal,
  ArrowUpRight
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { api } from '@/src/lib/axios';

interface User {
  id: string;
  firstName: string | null; 
  lastName: string | null;  
  email: string;
  role: "USER" | "VENDOR" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  _count?: { orders: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (error) {
      toast.error("SECURITY ERROR: Handshake failed during personnel retrieval.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-block`);
      toast.success(`PROTOCOL UPDATE: Access ${currentStatus ? 'Revoked' : 'Granted'}`);
      fetchUsers();
    } catch (error: any) {
      toast.error("OVERRIDE FAILED: System Conflict detected.");
    }
  };

  // Refactored Search to handle firstName, lastName, and email
  const filteredUsers = users.filter(u => {
    const searchStr = search.toLowerCase();
    const fullName = `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase();
    return (
      u.email.toLowerCase().includes(searchStr) || 
      fullName.includes(searchStr)
    );
  });

  return (
    <div className="p-8 space-y-8 bg-[#020202] min-h-screen text-zinc-100 selection:bg-blue-500/30">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/50 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-500">
            <Terminal size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Directory Access // Level 4</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
            User <span className="text-zinc-600">Control</span>
          </h1>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
            Protocol: Account Integrity Management
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-blue-500 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
          <div className="relative flex items-center bg-black border border-zinc-800 rounded-lg px-4 py-3">
            <Search className="w-4 h-4 text-zinc-600 mr-3" />
            <input 
              type="text"
              placeholder="FILTER BY DIGITAL IDENTITY..."
              className="bg-transparent border-none outline-none text-[10px] font-bold tracking-widest uppercase w-full md:w-64 placeholder:text-zinc-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* METRIC GRIDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Entities", value: users.length, icon: Users, color: "text-blue-500" },
          { label: "Authenticated", value: users.filter(u => u.isActive).length, icon: ShieldCheck, color: "text-emerald-500" },
          { label: "Restricted", value: users.filter(u => !u.isActive).length, icon: ShieldAlert, color: "text-rose-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/20 border border-zinc-800/50 p-6 rounded-2xl flex flex-col gap-1 relative overflow-hidden group">
            <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] ${stat.color} transition-transform group-hover:scale-110`} />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</span>
            <span className={`text-3xl font-black ${stat.color} tabular-nums`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* MAIN DATA TABLE */}
      <div className="rounded-2xl border border-zinc-800 bg-[#050505] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-zinc-800">
                <th className="p-6">User/Identity</th>
                <th className="p-6">Auth-Tier</th>
                <th className="p-6">Genesis</th>
                <th className="p-6">Operations</th>
                <th className="p-6 text-right">Access Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="p-10 bg-zinc-900/10"></td>
                  </tr>
                ))
              ) : filteredUsers.map((user) => {
                // Combine names for the display
                const fullName = (user.firstName || user.lastName) 
                  ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() 
                  : "UNIDENTIFIED_ENTITY";
                
                // Get initial for avatar
                const initial = (user.firstName?.[0] || user.lastName?.[0] || user.email[0]).toUpperCase();

                return (
                  <tr key={user.id} className="group hover:bg-zinc-800/20 transition-all duration-200">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 font-black text-sm group-hover:border-blue-500/50 transition-colors">
                            {initial}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#050505] ${user.isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.4)]'}`}></div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-200 group-hover:text-white transition-colors uppercase tracking-tight">
                            {fullName}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] rounded-md border ${
                        user.role === "ADMIN" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        user.role === "VENDOR" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                        "bg-zinc-900 text-zinc-500 border-zinc-800"
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono text-zinc-400">{format(new Date(user.createdAt), "dd-MM-yyyy")}</span>
                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Genesis</span>
                      </div>
                    </td>

                    <td className="p-6 text-sm font-mono">
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-zinc-700" />
                        <span className="text-zinc-300 font-black tracking-widest">{user._count?.orders ?? 0}</span>
                        <ArrowUpRight size={10} className="text-zinc-700" />
                      </div>
                    </td>

                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleToggleBlock(user.id, user.isActive)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                          user.isActive 
                          ? "text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20" 
                          : "text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20"
                        }`}
                      >
                        {user.isActive ? (
                          <><UserX size={14} /> Kill Protocol</>
                        ) : (
                          <><UserCheck size={14} /> Restore Protocol</>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}