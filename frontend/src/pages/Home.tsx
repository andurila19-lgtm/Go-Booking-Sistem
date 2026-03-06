import React, { useState, useEffect } from 'react'
import { Search as SearchIcon, MapPin, Calendar, Users, Star, ArrowRight, Loader } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatIDR } from '../utils/format'
import axios from 'axios'
import { Hotel } from '../types'

const Home: React.FC = () => {
    const navigate = useNavigate()
    const [destination, setDestination] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState('2')
    const [hotels, setHotels] = useState<Hotel[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get('/api/hotels')
                setHotels(response.data.slice(0, 4)) // Top 4 for featured
            } catch (err) {
                console.error("Failed to fetch hotels", err)
            } finally {
                setLoading(false)
            }
        }
        fetchHotels()
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (destination) params.set('location', destination)
        if (checkIn) params.set('checkin', checkIn)
        if (checkOut) params.set('checkout', checkOut)
        if (guests) params.set('guests', guests)

        navigate(`/search?${params.toString()}`)
    }

    const categories = [
        { name: 'Hotel', icon: '🏨', count: '12k+' },
        { name: 'Villa', icon: '🏡', count: '3k+' },
        { name: 'Apartment', icon: '🏢', count: '850+' },
        { name: 'Resort', icon: '🏖️', count: '1k+' },
        { name: 'Glamping', icon: '🏕️', count: '200+' },
        { name: 'Cottage', icon: '🛖', count: '500+' },
    ]

    const featuredDestinations = [
        { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80', properties: '4,200+' },
        { name: 'Jakarta', image: 'https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?auto=format&fit=crop&w=400&q=80', properties: '2,800+' },
        { name: 'Yogyakarta', image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=400&q=80', properties: '1,500+' },
        { name: 'Bandung', image: 'https://images.unsplash.com/photo-1549413247-f0cb0939509f?auto=format&fit=crop&w=400&q=80', properties: '1,200+' },
    ]

    return (
        <div className="bg-[#F1F2F8] min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center pt-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1920&q=80"
                        alt="Travel Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl tracking-tight leading-tight"
                        >
                            Temukan <span className="text-[#0062E3]">Ketenangan</span> <br /> di Destinasi Terbaik
                        </motion.h1>
                        <p className="text-white/80 text-lg font-medium max-w-2xl mx-auto mb-8">Booking hotel, villa, dan resort premium di seluruh Indonesia dengan harga terbaik dan konfirmasi instan.</p>
                    </div>

                    {/* Skyscanner Style Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-6xl mx-auto">
                        <div className="search-container overflow-visible backdrop-blur-md bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-0">
                            <div className="search-field group border-r border-slate-100">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Lokasi tujuan</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-[#0062E3]/5 flex items-center justify-center group-hover:bg-[#0062E3] group-hover:text-white transition-all duration-300">
                                        <MapPin size={18} className="text-[#0062E3] group-hover:text-white" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Mau ke mana?"
                                        className="bg-transparent w-full font-bold text-lg outline-none placeholder:text-slate-300"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="search-field group border-r border-slate-100">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Check-in</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-[#0062E3]/5 flex items-center justify-center group-hover:bg-[#0062E3] transition-all duration-300">
                                        <Calendar size={18} className="text-[#0062E3] group-hover:text-white" />
                                    </div>
                                    <input
                                        type="date"
                                        className="bg-transparent w-full font-bold text-lg outline-none cursor-pointer"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="search-field group border-r border-slate-100">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Check-out</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-[#0062E3]/5 flex items-center justify-center group-hover:bg-[#0062E3] transition-all duration-300">
                                        <Calendar size={18} className="text-[#0062E3] group-hover:text-white" />
                                    </div>
                                    <input
                                        type="date"
                                        className="bg-transparent w-full font-bold text-lg outline-none cursor-pointer"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="search-field group">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Tamu</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-[#0062E3]/5 flex items-center justify-center group-hover:bg-[#0062E3] transition-all duration-300">
                                        <Users size={18} className="text-[#0062E3] group-hover:text-white" />
                                    </div>
                                    <select
                                        className="bg-transparent w-full font-bold text-lg outline-none cursor-pointer appearance-none"
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}
                                    >
                                        <option value="1">1 tamu</option>
                                        <option value="2">2 tamu</option>
                                        <option value="4">4 tamu+</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-2 flex items-center justify-center">
                                <button
                                    type="submit"
                                    className="bg-[#0062E3] text-white h-full px-12 py-5 rounded-2xl flex items-center justify-center gap-3 font-extrabold text-xl hover:bg-[#0052bd] transition-all shadow-[0_10px_30px_rgba(0,98,227,0.3)] active:scale-95"
                                >
                                    CARI
                                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            {/* Skyscanner-like categories */}
            <section className="py-12 bg-white border-b border-slate-100 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between gap-12 overflow-x-auto pb-4 no-scrollbar">
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                to={`/search?type=${cat.name.toLowerCase()}`}
                                className="flex flex-col items-center gap-4 min-w-[100px] group text-center"
                            >
                                <div className="text-4xl transform group-hover:scale-125 transition-all duration-500 hover:rotate-6">
                                    {cat.icon}
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-slate-800 uppercase tracking-widest group-hover:text-[#0062E3] transition-colors">{cat.name}</span>
                                    <span className="text-[10px] text-slate-400 font-bold mt-1 bg-slate-50 px-2 py-0.5 rounded-full">{cat.count}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Destinations */}
            <section className="py-24 container mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#05203C] mb-3">Jelajahi Indonesia</h2>
                        <p className="text-slate-400 font-medium text-lg">Destinasi terpopuler yang wajib Anda kunjungi tahun ini</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {featuredDestinations.map((dest, idx) => (
                        <motion.div
                            key={dest.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -12 }}
                            className="group cursor-pointer relative"
                        >
                            <div className="relative h-64 rounded-[32px] overflow-hidden mb-4 shadow-xl group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-500">
                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#05203C]/90 via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="text-white text-2xl font-black tracking-tight">{dest.name}</h3>
                                    <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">{dest.properties} Properti</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Properties */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0062E3]/20 to-transparent" />
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl font-extrabold text-[#05203C] mb-4">Pilihan Terbaik Untuk Anda</h2>
                            <p className="text-slate-400 text-lg font-medium">Berdasarkan rating jutaan tamu dan standar layanan tertinggi</p>
                        </div>
                        <Link to="/search" className="group flex items-center gap-3 bg-[#F1F2F8] px-6 py-3 rounded-full hover:bg-[#0062E3] transition-all duration-300">
                            <span className="text-sm font-bold text-[#05203C] group-hover:text-white uppercase tracking-widest">Semua Properti</span>
                            <ArrowRight size={18} className="text-[#0062E3] group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader className="animate-spin text-[#0062E3]" size={40} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                            {hotels.map((hotel, idx) => (
                                <motion.div
                                    key={hotel.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="card group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                                >
                                    <div className="h-60 relative overflow-hidden">
                                        <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                                <Star size={14} fill="#FFB800" className="text-[#FFB800]" />
                                                <span className="text-xs font-black text-[#05203C]">{hotel.rating}</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <div className="bg-[#0062E3] text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                {hotel.type}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                                            <MapPin size={12} className="text-[#0062E3]" />
                                            <span>{hotel.city}, Indonesia</span>
                                        </div>
                                        <h3 className="text-xl font-black mb-6 text-[#05203C] line-clamp-1 leading-tight group-hover:text-[#0062E3] transition-colors">{hotel.name}</h3>

                                        <div className="flex justify-between items-end border-t border-slate-50 pt-6">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block mb-1">Harga mulai dari</span>
                                                <p className="text-2xl font-black text-[#0062E3]">{formatIDR(hotel.price_start)}</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-0.5">/ malam</p>
                                            </div>
                                            <Link to={`/hotel/${hotel.id}`} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#05203C] hover:bg-[#0062E3] hover:text-white transition-all duration-300 shadow-sm active:scale-90">
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Home
