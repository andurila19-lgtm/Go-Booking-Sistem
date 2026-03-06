import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Calendar, Package, Clock, Settings, User as UserIcon, CheckCircle, XCircle, ArrowRight, ShieldCheck } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Booking } from '../types'
import { motion } from 'framer-motion'
import { formatIDR } from '../utils/format'

const UserDashboard: React.FC = () => {
    const { user } = useAuth()

    const { data: bookings, isLoading } = useQuery<Booking[]>({
        queryKey: ['my-bookings'],
        queryFn: async () => {
            const res = await axios.get('/api/my-bookings')
            return res.data
        }
    })

    const stats = [
        { label: 'Booking Aktif', value: bookings?.filter(b => b.status === 'confirmed').length || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Menunggu', value: bookings?.filter(b => b.status === 'pending').length || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Dibatalkan', value: bookings?.filter(b => b.status === 'cancelled').length || 0, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    ]

    return (
        <div className="min-h-screen bg-[#F1F2F8] pt-24 pb-20">
            <div className="container mx-auto px-6">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-[#0062E3] font-bold text-xs uppercase tracking-widest mb-1">
                            <ShieldCheck size={14} />
                            Verified Account
                        </div>
                        <h1 className="text-4xl font-extrabold text-[#05203C]">Halo, {user?.name}!</h1>
                        <p className="text-slate-500 font-medium mt-2">Selamat datang kembali di pusat manajemen perjalanan Anda.</p>
                    </div>
                    <Link to="/search" className="btn-primary flex items-center gap-2">
                        Cari Destinasi Baru
                        <ArrowRight size={18} />
                    </Link>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-3xl border shadow-sm flex items-center justify-between group cursor-default"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`${stat.bg} ${stat.color} p-5 rounded-3xl transition-all group-hover:scale-110 shadow-sm shadow-black/5`}>
                                    <stat.icon size={32} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-4xl font-extrabold text-[#05203C]">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
                            <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-[#05203C] flex items-center gap-3">
                                    <Calendar size={22} className="text-[#0062E3]" />
                                    Daftar Booking Terbaru
                                </h2>
                                <Link to="/my-bookings" className="text-xs font-extrabold text-[#0062E3] uppercase tracking-widest hover:underline">Lihat Semua History</Link>
                            </div>
                            <div className="divide-y text-center">
                                {isLoading ? (
                                    <div className="p-20 text-slate-400 font-bold">Memuat histori booking...</div>
                                ) : bookings?.length === 0 ? (
                                    <div className="p-24 flex flex-col items-center">
                                        <Package size={80} className="text-slate-200 mb-6" />
                                        <p className="text-lg font-bold text-[#05203C] mb-2">Anda belum memiliki booking aktif</p>
                                        <p className="text-slate-400 text-sm mb-8">Mulailah petualangan pertama Anda bersama Bookify!</p>
                                        <Link to="/search" className="btn-secondary">Explore Sekarang</Link>
                                    </div>
                                ) : (
                                    bookings?.map((booking) => (
                                        <div key={booking.id} className="p-8 flex flex-col md:flex-row justify-between items-center text-left hover:bg-slate-50/50 transition-colors group">
                                            <div className="flex gap-6 items-center w-full">
                                                <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                    <img src={booking.service.image_url} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-extrabold uppercase text-[#0062E3] bg-blue-50 px-2 py-0.5 rounded tracking-widest">{booking.service.category}</span>
                                                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">#{booking.id}</span>
                                                    </div>
                                                    <h4 className="text-xl font-bold text-[#05203C] mb-2">{booking.service.title}</h4>
                                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                                                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(booking.booking_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                        <span className="text-[#0062E3] font-extrabold">{formatIDR(booking.service.price)} / malam</span>
                                                        <span className="flex items-center gap-1 uppercase">
                                                            <span className={`w-2 h-2 rounded-full ${booking.status === 'confirmed' ? 'bg-emerald-500' :
                                                                booking.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                                                                }`} />
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 mt-6 md:mt-0 w-full md:w-auto">
                                                <Link to={`/service/${booking.service_id}`} className="flex-1 md:flex-initial text-center px-6 py-3 bg-[#05203C] text-white text-xs font-bold rounded-xl hover:bg-[#082a4d] transition-all">Lihat Detail</Link>
                                                <button className="flex-1 md:flex-initial text-center px-6 py-3 bg-white border border-slate-200 text-[#05203C] text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">Download PDF</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Sidebar Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-10 rounded-3xl border shadow-sm text-center relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#0062E3] to-[#0052bd]" />
                            <div className="relative mt-4">
                                <div className="w-28 h-28 bg-white text-[#0062E3] rounded-full mx-auto mb-6 flex items-center justify-center border-8 border-white shadow-xl group-hover:scale-110 transition-all duration-500">
                                    <UserIcon size={56} />
                                </div>
                                <h3 className="text-2xl font-extrabold text-[#05203C] mb-1">{user?.name}</h3>
                                <p className="text-slate-400 font-medium mb-8">{user?.email}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-[#05203C] text-xs font-bold rounded-xl border border-slate-100 hover:bg-slate-100 transition-all shadow-sm">
                                        <Settings size={18} />
                                        Profil
                                    </button>
                                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-[#05203C] text-xs font-bold rounded-xl border border-slate-100 hover:bg-slate-100 transition-all shadow-sm">
                                        Edit Akun
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#05203C] p-10 rounded-3xl text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#0062E3]/20 rounded-full blur-[60px]" />
                            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#0062E3]/10 rounded-full blur-[60px]" />
                            <div className="relative">
                                <h3 className="text-2xl font-bold mb-4">Butuh Bantuan?</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8">Apabila Anda mengalami kesulitan dalam proses booking atau ingin melakukan refund, tim customer success kami siap membantu 24 jam sehari.</p>
                                <button className="w-full py-4 bg-[#0062E3] hover:bg-[#0052bd] rounded-xl font-bold transition-all shadow-lg shadow-[#0062E3]/20">Pusat Hubungi Bantuan</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDashboard
