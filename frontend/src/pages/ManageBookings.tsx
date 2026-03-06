import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Check, X, Loader, Search, Calendar, User, Package, Filter, MoreVertical, ShieldCheck, Mail, MapPin } from 'lucide-react'
import { Booking } from '../types'
import { motion, AnimatePresence } from 'framer-motion'

const ManageBookings: React.FC = () => {
    const queryClient = useQueryClient()

    const { data: bookings, isLoading } = useQuery<Booking[]>({
        queryKey: ['admin-bookings'],
        queryFn: async () => {
            const res = await axios.get('/api/bookings')
            return res.data
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, status }: { id: number, status: string }) => axios.put(`/api/bookings/${id}`, { status }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
    })

    return (
        <div className="min-h-screen bg-[#F1F2F8] p-8 lg:p-14">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#05203C]">Daftar Booking Masuk</h1>
                    <p className="text-slate-500 font-medium">Pantau dan konfirmasi reservasi dari seluruh pelanggan di sistem.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white border border-slate-200 text-[#05203C] rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all text-sm shadow-sm">
                        Download Report (CSV)
                    </button>
                </div>
            </header>

            {/* Control Bar */}
            <div className="bg-white p-4 rounded-2xl border shadow-sm mb-12 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari lewat nama pelanggan, id booking, atau layanan..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[#0062E3] outline-none font-medium"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    {['Semua', 'Pending', 'Confirmed', 'Cancelled'].map(s => (
                        <button key={s} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${s === 'Semua' ? 'bg-[#0062E3] text-white border-[#0062E3] shadow-lg shadow-[#0062E3]/20' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'
                            }`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden mb-20 relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#0062E3]" />

                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 text-[#05203C]">
                            <th className="p-8 text-xs font-extrabold uppercase tracking-widest border-b">Detail Pelanggan</th>
                            <th className="p-8 text-xs font-extrabold uppercase tracking-widest border-b">Layanan & Destinasi</th>
                            <th className="p-8 text-xs font-extrabold uppercase tracking-widest border-b">Tanggal Reservasi</th>
                            <th className="p-8 text-xs font-extrabold uppercase tracking-widest border-b">Status Booking</th>
                            <th className="p-8 text-xs font-extrabold uppercase tracking-widest border-b text-center">Konfirmasi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-24 text-center text-slate-400"><Loader className="animate-spin mx-auto mb-4" /> Memuat data...</td></tr>
                        ) : bookings?.length === 0 ? (
                            <tr><td colSpan={5} className="p-24 text-center text-slate-400 font-bold">Belum ada booking yang masuk saat ini.</td></tr>
                        ) : bookings?.map((booking) => (
                            <motion.tr
                                layout
                                key={booking.id}
                                className="hover:bg-slate-50/50 transition-colors group"
                            >
                                <td className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-extrabold shadow-sm">
                                            {booking.user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-[#05203C] group-hover:text-[#0062E3] transition-colors">{booking.user.name}</p>
                                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                <Mail size={10} />
                                                {booking.user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-12 rounded-xl overflow-hidden border">
                                            <img src={booking.service.image_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#05203C] text-sm">{booking.service.title}</p>
                                            <div className="flex items-center gap-1 text-[10px] text-[#0062E3] font-bold uppercase tracking-widest">
                                                <MapPin size={10} />
                                                {booking.service.location}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex flex-col">
                                        <span className="font-extrabold text-slate-700">{new Date(booking.booking_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Waktu check-in Terpilih</span>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest border-2 shadow-sm ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                                            booking.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100/50' :
                                                'bg-rose-50 text-rose-600 border-rose-100/50'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="p-8">
                                    <div className="flex justify-center gap-4">
                                        {booking.status === 'pending' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateMutation.mutate({ id: booking.id, status: 'confirmed' })}
                                                    className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 hover:scale-110 active:scale-95"
                                                    title="Confirm Booking"
                                                >
                                                    <Check size={20} />
                                                </button>
                                                <button
                                                    onClick={() => updateMutation.mutate({ id: booking.id, status: 'cancelled' })}
                                                    className="p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30 hover:scale-110 active:scale-95"
                                                    title="Cancel Booking"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-slate-200">
                                                <ShieldCheck size={28} />
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageBookings
