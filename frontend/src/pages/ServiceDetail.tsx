import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { MapPin, Users, Star, Calendar, Shield, Share2, Heart, Check, Loader, Info, Coffee, Wifi, Car, Waves, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Service } from '../types'
import { motion, AnimatePresence } from 'framer-motion'
import { formatIDR, calculateBookingSummary } from '../utils/format'

const ServiceDetail: React.FC = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [bookingDate, setBookingDate] = useState('')
    const [bookingLoading, setBookingLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const { data: service, isLoading } = useQuery<Service>({
        queryKey: ['service', id],
        queryFn: async () => {
            const res = await axios.get(`/api/services/${id}`)
            return res.data
        },
        enabled: !!id
    })

    const handleBooking = async () => {
        if (!user) {
            navigate('/login')
            return
        }

        if (!bookingDate) return

        setBookingLoading(true)
        try {
            await axios.post('/api/bookings', {
                service_id: parseInt(id!),
                user_id: user.id,
                booking_date: new Date(bookingDate).toISOString(),
                status: 'pending'
            })
            setSuccess(true)
            setTimeout(() => navigate('/dashboard'), 2000)
        } catch (err: any) {
            alert(err.response?.data?.message || 'Booking failed')
        } finally {
            setBookingLoading(false)
        }
    }

    const amenities = [
        { icon: Coffee, label: 'Sarapan' },
        { icon: Wifi, label: 'WiFi Cepat' },
        { icon: Car, label: 'Parkir Gratis' },
        { icon: Waves, label: 'Kolam Renang' },
    ]

    if (isLoading || !service) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <Loader className="animate-spin mx-auto text-[#0062E3] mb-4" size={48} />
                <p className="text-slate-500 font-bold">Memuat penawaran terbaik...</p>
            </div>
        </div>
    )

    const summary = calculateBookingSummary(service.price, 1)

    return (
        <div className="bg-[#F1F2F8] min-h-screen pb-24">
            {/* Detail Header & Gallery */}
            <div className="bg-white border-b pt-24 pb-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-[#05203C] text-white rounded text-[10px] font-bold uppercase tracking-wider">{service.category}</span>
                                <div className="flex items-center gap-1 text-amber-500">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                            </div>
                            <h1 className="text-4xl font-extrabold text-[#05203C] mb-4 tracking-tight">{service.title}</h1>
                            <div className="flex items-center gap-4 text-slate-500 font-medium">
                                <div className="flex items-center gap-1">
                                    <MapPin size={18} className="text-[#0062E3]" />
                                    <span>{service.location}</span>
                                </div>
                                <button className="text-[#0062E3] text-sm font-bold hover:underline">Tunjukkan di peta</button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-all border"><Share2 size={20} className="text-slate-600" /></button>
                            <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full transition-all border"><Heart size={20} className="text-slate-600" /></button>
                            <div className="flex items-center gap-4 pl-4 border-l">
                                <div className="text-right">
                                    <p className="font-bold text-[#05203C]">Luar Biasa</p>
                                    <p className="text-xs text-slate-400">1,240 review</p>
                                </div>
                                <div className="bg-[#05203C] text-white px-3 py-2 rounded-lg font-bold text-xl">9.2</div>
                            </div>
                        </div>
                    </div>

                    {/* Grid Gallery */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[550px] overflow-hidden rounded-3xl shadow-xl">
                        <div className="md:col-span-2 h-full">
                            <img src={service.image_url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="hidden md:grid grid-rows-2 gap-4 h-full">
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80" alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="hidden md:flex flex-col gap-4 h-full">
                            <div className="h-full relative overflow-hidden group">
                                <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="bg-white text-[#05203C] font-bold px-6 py-2 rounded-lg">Lihat Semua Foto</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Detailed Info */}
                    <div className="lg:col-span-2 space-y-12">
                        <section className="bg-white p-10 rounded-3xl border shadow-sm">
                            <h2 className="text-2xl font-bold text-[#05203C] mb-6 flex items-center gap-3">
                                <Info className="text-[#0062E3]" />
                                Deskripsi
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg mb-10">
                                {service.description || "Rasakan kemewahan tiada tara di properti eksklusif ini. Kami menawarkan layanan kelas dunia, fasilitas modern, dan pemandangan yang memukau. Sangat cocok bagi Anda yang menginginkan ketenangan dan kenyamanan maksimal selama masa menginap."}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y">
                                {amenities.map(item => (
                                    <div key={item.label} className="flex flex-col items-center gap-3">
                                        <div className="p-4 bg-slate-50 text-[#0062E3] rounded-2xl group hover:bg-[#0062E3] hover:text-white transition-all cursor-pointer">
                                            <item.icon size={32} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10">
                                <h3 className="text-xl font-bold text-[#05203C] mb-6">Fasilitas Populer</h3>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-12">
                                    {['Check-in 24 Jam', 'Pusat Kebugaran', 'Layanan Kamar', 'Bar & Lounge', 'Area Luar Ruangan', 'Batalkan Tanpa Biaya'].map(f => (
                                        <div key={f} className="flex items-center gap-3 text-slate-700 font-medium">
                                            <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                                <Check size={12} />
                                            </div>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Review Section (Mock) */}
                        <section className="bg-white p-10 rounded-3xl border shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-[#05203C]">Review Tamu</h2>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-bold text-[#05203C] text-xl">9.2 / 10</p>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Luar Biasa</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-8">
                                {[1, 2].map(r => (
                                    <div key={r} className="pb-8 border-b last:border-0 last:pb-0">
                                        <div className="flex justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full" />
                                                <div>
                                                    <p className="font-bold text-[#05203C]">Tamu Skyscanner #{r}</p>
                                                    <p className="text-xs text-slate-400">Februari 2026</p>
                                                </div>
                                            </div>
                                            <div className="bg-[#05203C] text-white px-2 py-1 rounded font-bold text-sm">9.5</div>
                                        </div>
                                        <p className="text-slate-600">"Sangat puas dengan pelayanannya. Kamar sangat bersih, sarapan sangat enak dan bervariasi. Sangat merekomendasikan tempat ini!"</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="card p-8 sticky top-32 border-0 shadow-2xl bg-white">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Mulai Dari</p>
                                    <span className="text-3xl font-extrabold text-[#0062E3]">{formatIDR(service.price)}</span>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Per Malam</p>
                                </div>
                                <div className="text-right">
                                    <Shield size={24} className="text-emerald-500 ml-auto mb-1" />
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Garansi Harga</span>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                {success ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-emerald-50 text-emerald-700 p-8 rounded-2xl text-center border-2 border-emerald-100"
                                    >
                                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Check size={32} />
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Booking Sukses!</h4>
                                        <p className="text-sm opacity-80">Kami telah mengirimkan detail konfirmasi ke email Anda.</p>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-100 focus-within:border-[#0062E3] transition-all">
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pilih Tanggal Reservasi</label>
                                            <div className="flex items-center gap-3">
                                                <Calendar size={20} className="text-[#0062E3]" />
                                                <input
                                                    type="date"
                                                    className="bg-transparent w-full font-bold text-[#05203C] outline-none"
                                                    value={bookingDate}
                                                    onChange={(e) => setBookingDate(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4 py-6 border-y">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ringkasan Harga</h4>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Harga per malam</span>
                                                <span className="font-bold">{formatIDR(service.price)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">PPN (11%)</span>
                                                <span className="font-medium">{formatIDR(summary.tax)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Service Fee (5%)</span>
                                                <span className="font-medium">{formatIDR(summary.serviceFee)}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-slate-100 mt-4">
                                                <span className="text-lg font-bold text-[#05203C]">Total Bayar</span>
                                                <span className="text-2xl font-extrabold text-[#0062E3]">{formatIDR(summary.total)}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleBooking}
                                            disabled={!bookingDate || bookingLoading}
                                            className="w-full btn-primary py-5 rounded-xl text-xl font-bold flex items-center justify-center gap-3 group"
                                        >
                                            {bookingLoading ? <Loader className="animate-spin" /> : (
                                                <>
                                                    Bayar Sekarang
                                                    <motion.div
                                                        animate={{ x: [0, 5, 0] }}
                                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                                    >
                                                        <ArrowRight size={24} />
                                                    </motion.div>
                                                </>
                                            )}
                                        </button>

                                        <div className="flex flex-col items-center gap-4">
                                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Metode Pembayaran Tersedia</p>
                                            <div className="flex flex-wrap justify-center gap-2 opacity-60">
                                                {['Virtual Account', 'GoPay', 'OVO', 'Dana'].map(p => (
                                                    <span key={p} className="px-2 py-1 bg-slate-100 text-[8px] font-bold rounded border uppercase">{p}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceDetail
