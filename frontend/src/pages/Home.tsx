import React, { useState } from 'react'
import { Search as SearchIcon, MapPin, Calendar, Users, Star, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatIDR } from '../utils/format'

const Home: React.FC = () => {
    const navigate = useNavigate()
    const [destination, setDestination] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState('2')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (destination) params.set('q', destination)
        if (checkIn) params.set('checkin', checkIn)
        if (checkOut) params.set('checkout', checkOut)
        if (guests) params.set('guests', guests)

        navigate(`/search?${params.toString()}`)
    }

    const categories = [
        { name: 'Hotel', icon: '🏨', count: '12,504' },
        { name: 'Villa', icon: '🏡', count: '3,210' },
        { name: 'Olahraga', icon: '⚽', count: '850' },
        { name: 'Salon', icon: '💇', count: '1,420' },
        { name: 'Konsultasi', icon: '💼', count: '2,100' },
        { name: 'Event', icon: '🎪', count: '640' },
    ]

    const featuredDestinations = [
        { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80', properties: '4,200+' },
        { name: 'Jakarta', image: 'https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?auto=format&fit=crop&w=400&q=80', properties: '2,800+' },
        { name: 'Yogyakarta', image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=400&q=80', properties: '1,500+' },
        { name: 'Bandung', image: 'https://images.unsplash.com/photo-1549413247-f0cb0939509f?auto=format&fit=crop&w=400&q=80', properties: '1,200+' },
    ]

    return (
        <div className="bg-[#F1F2F8] min-h-screen">
            {/* Hero Section with Background image */}
            <section className="relative h-[550px] flex items-center justify-center pt-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1920&q=80"
                        alt="Travel Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight"
                        >
                            Temukan tempat menginap & layanan terbaik
                        </motion.h1>
                    </div>

                    {/* Skyscanner Style Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-6xl mx-auto">
                        <div className="search-container overflow-visible backdrop-blur-sm bg-white/95">
                            <div className="search-field group">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lokasi tujuan</label>
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} className="text-[#0062E3]" />
                                    <input
                                        type="text"
                                        placeholder="Ke mana Anda ingin pergi?"
                                        className="bg-transparent w-full font-bold text-lg outline-none placeholder:text-slate-300"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="search-field group">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Check-in</label>
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-[#0062E3]" />
                                    <input
                                        type="date"
                                        className="bg-transparent w-full font-bold text-lg outline-none cursor-pointer"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="search-field group">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Check-out</label>
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-[#0062E3]" />
                                    <input
                                        type="date"
                                        className="bg-transparent w-full font-bold text-lg outline-none cursor-pointer"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="search-field group">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tamu</label>
                                <div className="flex items-center gap-2">
                                    <Users size={18} className="text-[#0062E3]" />
                                    <select
                                        className="bg-transparent w-full font-bold text-lg outline-none cursor-pointer appearance-none"
                                        value={guests}
                                        onChange={(e) => setGuests(e.target.value)}
                                    >
                                        <option value="1">1 tamu</option>
                                        <option value="2">2 tamu</option>
                                        <option value="3">3 tamu</option>
                                        <option value="4">4 tamu+</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-2 flex items-center justify-center">
                                <button
                                    type="submit"
                                    className="bg-[#0062E3] text-white h-full px-12 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xl hover:bg-[#0052bd] transition-all shadow-lg active:scale-95"
                                >
                                    Cari
                                    <ArrowRight size={24} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            {/* Skyscanner-like categories (Simple, clean scrollable) */}
            <section className="py-12 bg-white border-b">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-center gap-12 overflow-x-auto pb-4 no-scrollbar">
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                to={`/search?category=${cat.name}`}
                                className="flex flex-col items-center gap-3 min-w-[80px] group"
                            >
                                <div className="text-3xl grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110">
                                    {cat.icon}
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-[#0062E3]">{cat.name}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">{cat.count} opsi</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Destinations (Skyscanner style grid) */}
            <section className="py-20 container mx-auto px-6">
                <div className="mb-10">
                    <h2 className="text-2xl font-bold mb-2">Destinasi Populer</h2>
                    <p className="text-slate-500 font-medium">Beberapa pilihan terbaik bagi pemburu pengalaman unik</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {featuredDestinations.map((dest) => (
                        <motion.div
                            key={dest.name}
                            whileHover={{ y: -8 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative h-48 rounded-2xl overflow-hidden mb-4 shadow-lg group-hover:shadow-2xl transition-all">
                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-white text-xl font-bold">{dest.name}</h3>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-500">{dest.properties} Properti tersedia</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Services (Skyscanner content style) */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Rekomendasi Terbaik</h2>
                            <p className="text-slate-500">Pilihan editor berdasarkan rating dan ketersediaan</p>
                        </div>
                        <Link to="/search" className="text-[#0062E3] font-bold hover:underline flex items-center gap-1 uppercase tracking-wider text-xs">
                            Lihat Semua
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="card group">
                                <div className="h-48 bg-slate-100 relative">
                                    <img src={`https://images.unsplash.com/photo-${1510000000000 + item}?auto=format&fit=crop&w=400&q=80`} alt="service" className="w-full h-full object-cover" />
                                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded text-[10px] font-bold text-slate-900 border shadow-sm">
                                        SKYSCORE™ 9.2
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                                        <Star size={12} fill="currentColor" />
                                        <span className="text-[11px] font-bold text-slate-900 uppercase">Sangat Bagus</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-1 text-slate-900 line-clamp-1">Grand Executive Villa & Spa</h3>
                                    <div className="flex items-center gap-1 text-slate-500 text-xs mb-6">
                                        <MapPin size={12} />
                                        <span>Jimbaran, Bali</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t pt-4">
                                        <div>
                                            <span className="text-sm text-slate-400">Mulai dari</span>
                                            <p className="text-xl font-bold text-[#0062E3]">{formatIDR(1250000)}</p>
                                        </div>
                                        <Link to={`/service/${item}`} className="px-4 py-2 bg-[#F1F2F8] text-[#05203C] font-bold text-xs rounded hover:bg-slate-200 transition-all">
                                            PILIH
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
