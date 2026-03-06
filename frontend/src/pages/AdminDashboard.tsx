import React from 'react'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Package, Calendar, Users, BarChart2, Settings, Plus, ArrowUpRight, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Booking, Service } from '../types'
import { motion } from 'framer-motion'
import { formatIDR } from '../utils/format'

const AdminDashboard: React.FC = () => {
    const { user } = useAuth()

    const { data: bookings, isLoading: loadingBookings } = useQuery<Booking[]>({
        queryKey: ['all-bookings'],
        queryFn: async () => {
            const res = await axios.get('/api/bookings')
            return res.data
        }
    })

    const { data: services, isLoading: loadingServices } = useQuery<Service[]>({
        queryKey: ['all-services'],
        queryFn: async () => {
            const res = await axios.get('/api/services')
            return res.data
        }
    })

    const totalRevenue = (bookings || []).reduce((acc: number, b: Booking) => acc + (b.service?.price || 0), 0)

    const stats = [
        { label: 'Total Services', value: services?.length || 0, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50', change: '+2.4%' },
        { label: 'Total Bookings', value: bookings?.length || 0, icon: Calendar, color: 'text-sky-600', bg: 'bg-sky-50', change: '+14.8%' },
        { label: 'Revenue (All)', value: formatIDR(totalRevenue), icon: BarChart2, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+5.7%' },
    ]

    return (
        <div className="min-h-screen bg-[#F1F2F8] flex">
            {/* Sidebar (Skyscanner Navy) */}
            <aside className="w-80 bg-[#05203C] text-white hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl z-50 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#0062E3]/20 rounded-full blur-[80px]" />

                <div className="p-10 relative">
                    <Link to="/" className="text-3xl font-extrabold flex items-center gap-3 tracking-tight">
                        <div className="w-10 h-10 bg-[#0062E3] rounded-xl flex items-center justify-center shadow-lg shadow-[#0062E3]/30 animate-pulse">
                            <Calendar size={24} />
                        </div>
                        <span>Bookify<span className="text-[#0062E3]">Admin</span></span>
                    </Link>
                </div>

                <nav className="flex-1 px-8 py-4 space-y-3 relative">
                    {[
                        { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
                        { label: 'Manajemen Layanan', icon: Package, path: '/admin/services' },
                        { label: 'Daftar Booking', icon: Calendar, path: '/admin/bookings' },
                        { label: 'Statistik & Laporan', icon: BarChart2, path: '/admin/reports' },
                        { label: 'Pengaturan', icon: Settings, path: '/admin/settings' },
                    ].map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300
                ${isActive ? 'bg-[#0062E3] text-white shadow-xl shadow-[#0062E3]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-8 relative">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100/10 border border-white/20 flex items-center justify-center">
                                <Users size={18} className="text-[#0062E3]" />
                            </div>
                            <div className="text-xs">
                                <p className="font-bold">Role: Super Admin</p>
                                <p className="text-slate-500">{user?.email}</p>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">Logout</button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 lg:p-14 overflow-y-auto pt-24">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#05203C]">Admin Control Center</h1>
                        <p className="text-slate-500 font-medium">Selamat datang, {user?.name}. Kelola layanan dan pantau booking secara real-time.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/admin/services" className="px-6 py-3 bg-[#05203C] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#082a4d] transition-all shadow-lg shadow-black/10">
                            <Plus size={20} />
                            Tambah Layanan
                        </Link>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-3xl border shadow-sm group hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm bg-emerald-50 px-2 py-1 rounded-lg">
                                    <TrendingUp size={14} />
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-4xl font-extrabold text-[#05203C] leading-tight">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Recent Bookings Table */}
                    <section className="bg-white rounded-3xl border shadow-sm overflow-hidden">
                        <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-[#05203C] flex items-center gap-2">
                                <Clock size={20} className="text-[#0062E3]" />
                                Recent Bookings
                            </h3>
                            <Link to="/admin/bookings" className="text-xs font-bold text-[#0062E3] uppercase hover:underline">Semua Booking</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-100/50 text-[#05203C]">
                                        <th className="p-6 text-xs font-extrabold uppercase tracking-widest">Customer</th>
                                        <th className="p-6 text-xs font-extrabold uppercase tracking-widest">Layanan</th>
                                        <th className="p-6 text-xs font-extrabold uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {loadingBookings ? (
                                        <tr><td colSpan={3} className="p-12 text-center text-slate-400 font-bold">Memuat data...</td></tr>
                                    ) : bookings?.length === 0 ? (
                                        <tr><td colSpan={3} className="p-12 text-center text-slate-400">Belum ada booking terkini</td></tr>
                                    ) : bookings?.slice(0, 5).map(b => (
                                        <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-6">
                                                <p className="font-bold text-[#05203C]">{b.user.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{b.user.email}</p>
                                            </td>
                                            <td className="p-6">
                                                <p className="font-bold text-slate-700">{b.service.title}</p>
                                                <p className="text-[10px] text-[#0062E3] font-extrabold">{new Date(b.booking_date).toLocaleDateString()}</p>
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    b.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-rose-50 text-rose-600 border-rose-100'
                                                    }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* System Status / Alerts */}
                    <section className="bg-white rounded-3xl border shadow-sm p-8">
                        <h3 className="text-lg font-bold text-[#05203C] mb-8 flex items-center gap-2">
                            <AlertCircle size={20} className="text-[#0062E3]" />
                            System Overview
                        </h3>
                        <div className="space-y-6">
                            <div className="p-6 bg-[#05203C] text-white rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                    <TrendingUp size={80} />
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Layanan Aktif</p>
                                <div className="flex items-center gap-4">
                                    <p className="text-5xl font-extrabold">{services?.length || 0}</p>
                                    <div className="w-1.5 h-12 bg-[#0062E3] rounded-full" />
                                    <p className="text-xs text-slate-400 max-w-[120px]">Semua sistem berjalan normal di server utama.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 border-2 border-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Server Latency</p>
                                    <p className="text-2xl font-extrabold text-emerald-500">24ms</p>
                                </div>
                                <div className="p-6 border-2 border-slate-50 rounded-2xl">
                                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">DB Connection</p>
                                    <p className="text-2xl font-extrabold text-emerald-500">100%</p>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-slate-50 text-[#05203C] font-bold rounded-xl border hover:bg-slate-100 transition-all flex items-center justify-center gap-2 group">
                                Launch System Analytics
                                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default AdminDashboard
