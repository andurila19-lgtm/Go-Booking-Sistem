import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Star, Wifi, Coffee, Wind, Car, Shield, Calendar, Users, ArrowRight, Check, Loader, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatIDR, calculateBookingSummary } from '../utils/format'
import axios from 'axios'
import { Hotel, Room } from '../types'
import { useAuth } from '../context/AuthContext'

const HotelDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [hotel, setHotel] = useState<Hotel | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
    const [bookingLoading, setBookingLoading] = useState(false)

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await axios.get(`/api/hotels/${id}`)
                setHotel(response.data)
            } catch (err) {
                setError('Property not found')
            } finally {
                setLoading(false)
            }
        }
        fetchHotel()
    }, [id])

    const handleBooking = async (room: Room) => {
        if (!user) {
            navigate('/login')
            return
        }

        if (!checkIn || !checkOut) {
            setError('Please select check-in and check-out dates')
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }

        setBookingLoading(true)
        try {
            const summary = calculateBookingSummary(room.price, 1) // default 1 day for demo logic
            await axios.post('/api/bookings', {
                room_id: room.id,
                hotel_id: hotel?.id,
                check_in_date: new Date(checkIn).toISOString(),
                check_out_date: new Date(checkOut).toISOString(),
                payment_method: 'bank_transfer'
            })
            navigate('/dashboard', { state: { message: 'Booking successful!' } })
        } catch (err: any) {
            setError(err.response?.data?.message || 'Booking failed')
        } finally {
            setBookingLoading(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F2F8]">
            <Loader className="animate-spin text-[#0062E3] mb-4" size={48} />
            <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Menyiapkan Pengalaman Anda...</p>
        </div>
    )

    if (error || !hotel) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F2F8]">
            <div className="text-center bg-white p-12 rounded-[32px] shadow-xl max-w-md">
                <Info className="text-[#EA4335] mx-auto mb-6" size={64} />
                <h2 className="text-2xl font-black text-[#05203C] mb-4">Ups! Terjadi Kesalahan</h2>
                <p className="text-slate-500 font-medium mb-8">{error || 'Data tidak ditemukan'}</p>
                <button onClick={() => navigate('/')} className="w-full btn-primary py-4 rounded-2xl font-bold">Kembali ke Beranda</button>
            </div>
        </div>
    )

    return (
        <div className="bg-[#F1F2F8] min-h-screen pb-32">
            {/* Gallery / Hero */}
            <div className="relative h-[450px] overflow-hidden">
                <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05203C]/80 via-transparent to-transparent" />

                <div className="absolute bottom-12 left-0 w-full">
                    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-[#0062E3] text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">Premium {hotel.type}</span>
                                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white">
                                    <Star size={14} fill="#FFB800" className="text-[#FFB800]" />
                                    <span className="text-xs font-black">{hotel.rating} / 5.0</span>
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-2xl">{hotel.name}</h1>
                            <div className="flex items-center gap-2 text-white/90 font-bold uppercase tracking-widest text-xs">
                                <MapPin size={18} className="text-[#0062E3]" />
                                <span>{hotel.address}, {hotel.city}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Mulai Dari</span>
                            <div className="text-4xl font-black text-white">{formatIDR(hotel.price_start)}<span className="text-sm font-bold text-white/50"> / malam</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 -mt-16 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description & Facilities */}
                        <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-[#05203C]/5 border border-white">
                            <h2 className="text-2xl font-black text-[#05203C] mb-8 flex items-center gap-3 border-b border-slate-50 pb-6 uppercase tracking-tight">
                                <Info className="text-[#0062E3]" size={24} />
                                Mengenai Properti
                            </h2>
                            <p className="text-slate-500 font-medium leading-relaxed mb-10 text-lg italic pr-6 border-l-4 border-[#0062E3]/20 pl-6">
                                "{hotel.description}"
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Gratis WiFi', icon: Wifi },
                                    { label: 'Sarapan', icon: Coffee },
                                    { label: 'AC', icon: Wind },
                                    { label: 'Parkir', icon: Car },
                                    { label: 'Akses 24 Jam', icon: Shield },
                                    { label: 'Premium Bedding', icon: Wind }
                                ].map((fac) => (
                                    <div key={fac.label} className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-3xl group hover:bg-[#0062E3] transition-all duration-300 shadow-sm hover:shadow-xl hover:scale-105">
                                        <fac.icon size={24} className="text-[#0062E3] group-hover:text-white transition-colors" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white/90 transition-colors text-center">{fac.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rooms List */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-3xl font-black text-[#05203C] tracking-tight">PILIHAN UNIT TERSEDIA</h2>
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{hotel.rooms?.length || 0} Unit Tersedia</span>
                            </div>

                            <div className="space-y-6">
                                {hotel.rooms?.map((room) => (
                                    <motion.div
                                        key={room.id}
                                        whileHover={{ x: 10 }}
                                        className={`bg-white rounded-[32px] overflow-hidden border-2 transition-all duration-500 group flex flex-col md:flex-row shadow-lg hover:shadow-2xl ${selectedRoom?.id === room.id ? 'border-[#0062E3] ring-4 ring-[#0062E3]/10 scale-[1.02]' : 'border-transparent'}`}
                                        onClick={() => setSelectedRoom(room)}
                                    >
                                        <div className="w-full md:w-80 h-64 md:h-auto overflow-hidden relative">
                                            <img src={room.image_url || hotel.image_url} alt={room.type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            {room.is_available && (
                                                <div className="absolute top-4 left-4 bg-[#0062E3] text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Ready to Book</div>
                                            )}
                                        </div>
                                        <div className="p-10 flex-grow">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h3 className="text-2xl font-black text-[#05203C] mb-2 uppercase tracking-tight group-hover:text-[#0062E3] transition-colors">{room.type}</h3>
                                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                        <Users size={14} className="text-[#0062E3]/60" />
                                                        <span>Maksimal {room.capacity} Tamu</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Per Malam</span>
                                                    <p className="text-3xl font-black text-[#0062E3] tracking-tighter">{formatIDR(room.price)}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3 mb-10">
                                                {['King Size Bed', 'Mountain View', 'Private Balcony', 'Nespresso'].map(f => (
                                                    <span key={f} className="bg-slate-50 text-[10px] text-slate-500 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">{f}</span>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-[#0062E3]/20 transition-all duration-300">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedRoom?.id === room.id ? 'bg-[#0062E3] border-[#0062E3]' : 'bg-white border-slate-200'}`}>
                                                        {selectedRoom?.id === room.id && <Check size={14} className="text-white" />}
                                                    </div>
                                                    <span className="font-black text-[#05203C] text-sm uppercase tracking-widest">{selectedRoom?.id === room.id ? 'TELAH DIPILIH' : 'PILIH UNIT INI'}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleBooking(room); }}
                                                    disabled={bookingLoading}
                                                    className={`px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${selectedRoom?.id === room.id ? 'bg-[#0062E3] text-white shadow-lg shadow-[#0062E3]/30 scale-105 active:scale-95' : 'bg-white text-slate-400 border border-slate-200 hover:border-[#0062E3] hover:text-[#0062E3]'}`}
                                                >
                                                    {bookingLoading ? 'Memproses...' : 'Booking Sekarang'}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Check Availability */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0062E3]/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

                                <h3 className="text-xl font-black text-[#05203C] mb-8 uppercase tracking-widest border-b border-slate-50 pb-6 flex items-center gap-3">
                                    <Calendar className="text-[#0062E3]" size={22} />
                                    Cek Ketersediaan
                                </h3>

                                <div className="space-y-6 mb-10">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Check-in</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0062E3] transition-colors" size={18} />
                                            <input
                                                type="date"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#0062E3] focus:bg-white outline-none transition-all font-black text-[#05203C] placeholder:text-slate-300"
                                                value={checkIn}
                                                onChange={(e) => setCheckIn(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Check-out</label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0062E3] transition-colors" size={18} />
                                            <input
                                                type="date"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#0062E3] focus:bg-white outline-none transition-all font-black text-[#05203C] placeholder:text-slate-300"
                                                value={checkOut}
                                                onChange={(e) => setCheckOut(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {selectedRoom && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="bg-[#0062E3]/5 p-8 rounded-3xl border-2 border-[#0062E3]/10 mb-10"
                                    >
                                        <h4 className="text-[11px] font-black text-[#0062E3] uppercase tracking-widest mb-4 border-b border-[#0062E3]/10 pb-4">Ringkasan Pilihan</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs font-bold text-slate-600 uppercase tracking-tight">
                                                <span>{selectedRoom.type}</span>
                                                <span>{formatIDR(selectedRoom.price)}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <span>PPN & Service (16%)</span>
                                                <span>{formatIDR(selectedRoom.price * 0.16)}</span>
                                            </div>
                                            <div className="flex justify-between pt-4 border-t border-[#0062E3]/10">
                                                <span className="text-xs font-black text-[#05203C] uppercase tracking-widest">Total Estimasi</span>
                                                <span className="text-lg font-black text-[#0062E3]">{formatIDR(selectedRoom.price * 1.16)}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <button
                                    onClick={() => selectedRoom ? handleBooking(selectedRoom) : null}
                                    disabled={!selectedRoom || bookingLoading}
                                    className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-xl shadow-[#0062E3]/20 transition-all ${selectedRoom ? 'bg-[#0062E3] text-white hover:bg-[#0052bd] hover:scale-[1.02] active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                                >
                                    {bookingLoading ? <Loader className="animate-spin" size={24} /> : 'KONFIRMASI BOOKING'}
                                    {!bookingLoading && <ArrowRight size={22} />}
                                </button>

                                <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-[0.2em] mt-8">Secure IDR Payments Powered by Adyen</p>
                            </div>

                            <div className="bg-[#05203C] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl group cursor-pointer hover:bg-[#082a4d] transition-colors">
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                                <h4 className="text-lg font-black mb-4 tracking-tight uppercase">Butuh Bantuan?</h4>
                                <p className="text-white/60 text-sm font-medium mb-8 leading-relaxed">Tim concierge kami tersedia 24/7 untuk membantu reservasi grup atau permintaan khusus di {hotel.name}.</p>
                                <button className="w-full py-4 rounded-2xl border-2 border-white/20 font-black text-xs uppercase tracking-widest hover:bg-white hover:text-[#05203C] transition-all">Hubungi Concierge</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default HotelDetail
