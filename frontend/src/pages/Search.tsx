import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Search as SearchIcon, Filter, MapPin, Star, Calendar, Users, ChevronDown, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Service } from '../types'
import { formatIDR } from '../utils/format'

const Search: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const initialQuery = searchParams.get('q') || ''
    const initialCheckIn = searchParams.get('checkin') || ''
    const initialCheckOut = searchParams.get('checkout') || ''
    const initialGuests = searchParams.get('guests') || '2'

    const [query, setQuery] = useState(initialQuery)
    const [checkIn, setCheckIn] = useState(initialCheckIn)
    const [checkOut, setCheckOut] = useState(initialCheckOut)
    const [guests, setGuests] = useState(initialGuests)
    const [activeCategory, setActiveCategory] = useState<string | null>(searchParams.get('category'))

    const { data: services, isLoading } = useQuery<Service[]>({
        queryKey: ['services', searchParams.toString()],
        queryFn: async () => {
            const res = await axios.get('/api/services')
            const q = searchParams.get('q')?.toLowerCase() || ''
            const cat = searchParams.get('category')?.toLowerCase() || ''

            return res.data.filter((s: Service) => {
                const matchesQuery = s.title.toLowerCase().includes(q) ||
                    s.location.toLowerCase().includes(q)
                const matchesCategory = cat ? s.category.toLowerCase() === cat : true
                return matchesQuery && matchesCategory
            })
        }
    })

    const handleSearch = () => {
        const params: any = {}
        if (query) params.q = query
        if (checkIn) params.checkin = checkIn
        if (checkOut) params.checkout = checkOut
        if (guests) params.guests = guests
        if (activeCategory) params.category = activeCategory

        setSearchParams(params)
    }

    const filters = [
        { title: 'Tipe Properti', items: ['Hotel', 'Villa', 'Apartemen', 'Resort'] },
        { title: 'Bintang', items: ['5 Bintang', '4 Bintang', '3 Bintang'] },
        { title: 'Fasilitas', items: ['Sarapan', 'WiFi', 'Kolam Renang', 'Parkir'] },
    ]

    return (
        <div className="bg-[#F1F2F8] min-h-screen">
            {/* Search Header (Skyscanner style) */}
            <div className="bg-[#05203C] pt-24 pb-12">
                <div className="container mx-auto px-6">
                    <div className="bg-white p-1 rounded-xl shadow-2xl flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x max-w-6xl mx-auto">
                        <div className="flex-[2] p-3 flex flex-col justify-center">
                            <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 px-3 underline decoration-[#0062E3] underline-offset-4">Tujuan</label>
                            <div className="flex items-center gap-2 px-3">
                                <MapPin size={16} className="text-[#0062E3]" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Cari lokasi atau nama properti..."
                                    className="w-full font-bold text-slate-800 outline-none placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                        <div className="flex-1 p-3 flex flex-col justify-center">
                            <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 px-3">Check-in</label>
                            <div className="flex items-center gap-2 px-3">
                                <Calendar size={16} className="text-[#0062E3]" />
                                <input
                                    type="date"
                                    className="font-bold text-slate-800 outline-none w-full bg-transparent"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex-1 p-3 flex flex-col justify-center">
                            <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 px-3">Tamu</label>
                            <div className="flex items-center gap-2 px-3">
                                <Users size={16} className="text-[#0062E3]" />
                                <select
                                    className="font-bold text-slate-800 outline-none w-full bg-transparent appearance-none"
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                >
                                    <option value="1">1 Dewasa</option>
                                    <option value="2">2 Dewasa</option>
                                    <option value="3">3 Dewasa</option>
                                    <option value="4">4 Dewasa+</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={handleSearch}
                                className="bg-[#0062E3] text-white h-full px-8 py-3 lg:py-0 rounded-lg font-bold hover:bg-[#0052bd] transition-all w-full"
                            >
                                Cari
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-72 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-[#05203C]">Filter</h3>
                            <button className="text-[#0062E3] text-xs font-bold">Hapus semua</button>
                        </div>

                        {filters.map((group) => (
                            <div key={group.title} className="mb-6 pt-6 border-t first:border-t-0 first:pt-0">
                                <h4 className="font-bold text-sm mb-4 flex justify-between items-center cursor-pointer">
                                    {group.title}
                                    <ChevronDown size={14} className="text-slate-400" />
                                </h4>
                                <div className="space-y-3">
                                    {group.items.map(item => (
                                        <label key={item} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#0062E3] focus:ring-[#0062E3]" />
                                            <span className="text-sm text-slate-600 group-hover:text-[#0062E3] transition-colors">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#05203C] p-6 rounded-2xl text-white">
                        <h4 className="font-bold mb-2">Butuh bantuan?</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">Tim support kami tersedia 24/7 untuk membantu reservasi Anda.</p>
                        <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold border border-white/20 transition-all">Hubungi Kami</button>
                    </div>
                </aside>

                {/* Results List */}
                <main className="flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-[#05203C]">
                            {isLoading ? 'Mencari...' : `${services?.length || 0} hasil ditemukan`}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Urutkan:</span>
                            <select className="bg-transparent font-bold text-[#0062E3] text-sm outline-none">
                                <option>Paling Relevan</option>
                                <option>Harga Termurah</option>
                                <option>Rating Tertinggi</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {isLoading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-64 bg-white animate-pulse rounded-2xl border" />)
                        ) : services?.length === 0 ? (
                            <div className="bg-white p-20 rounded-2xl text-center border">
                                <SearchIcon size={64} className="mx-auto text-slate-200 mb-6" />
                                <h3 className="text-xl font-bold text-[#05203C] mb-2">Tidak ada hasil ditemukan</h3>
                                <p className="text-slate-500">Coba ubah kata kunci atau hapus filter</p>
                            </div>
                        ) : (
                            services?.map((service) => (
                                <motion.div
                                    key={service.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col md:flex-row group"
                                >
                                    <div className="w-full md:w-80 h-64 md:h-auto overflow-hidden relative">
                                        <img src={service.image_url} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/90 backdrop-blur text-[#0062E3] font-bold text-[10px] uppercase rounded shadow-sm border border-[#0062E3]/20">
                                                {service.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 p-8 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="flex items-center gap-1 text-amber-500 mb-1">
                                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                                                    <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Official Partner</span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-[#05203C] mb-2 group-hover:text-[#0062E3] transition-colors">{service.title}</h3>
                                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                    <MapPin size={14} className="text-[#0062E3]" />
                                                    <span>{service.location}</span>
                                                </div>
                                            </div>
                                            <div className="bg-[#05203C] text-white p-3 rounded-lg text-center min-w-[60px]">
                                                <span className="block text-lg font-bold">9.4</span>
                                                <span className="text-[8px] uppercase font-bold tracking-widest opacity-60">Luar Biasa</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Sarapan Gratis</span>
                                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> WiFi</span>
                                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Batalkan Gratis</span>
                                        </div>

                                        <div className="mt-auto pt-8 border-t flex items-end justify-between">
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Harga per malam</p>
                                                <p className="text-3xl font-extrabold text-[#05203C]">{formatIDR(service.price)}</p>
                                                <p className="text-[10px] text-emerald-600 font-bold">Termasuk pajak & biaya</p>
                                            </div>
                                            <Link to={`/service/${service.id}`} className="btn-primary flex items-center gap-2">
                                                Lihat Penawaran
                                                <ArrowRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Search
