import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Plus, Edit2, Trash2, X, Upload, MapPin, Tag, Users, DollarSign, Package, Check, Loader, Filter, Search } from 'lucide-react'
import { Service } from '../types'
import { motion, AnimatePresence } from 'framer-motion'

const ManageServices: React.FC = () => {
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [searchTerm, setSearchTerm] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Hotel',
        image_url: '',
        price: 0,
        location: '',
        capacity: 0
    })

    const { data: services, isLoading } = useQuery<Service[]>({
        queryKey: ['admin-services'],
        queryFn: async () => {
            const res = await axios.get('/api/services')
            return res.data
        }
    })

    const mutation = useMutation({
        mutationFn: (newService: any) => {
            if (editingService) {
                return axios.put(`/api/services/${editingService.id}`, newService)
            }
            return axios.post('/api/services', newService)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-services'] })
            handleCloseModal()
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => axios.delete(`/api/services/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-services'] })
    })

    const handleEdit = (service: Service) => {
        setEditingService(service)
        setFormData({
            title: service.title,
            description: service.description,
            category: service.category,
            image_url: service.image_url,
            price: service.price,
            location: service.location,
            capacity: service.capacity
        })
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingService(null)
        setFormData({
            title: '',
            description: '',
            category: 'Hotel',
            image_url: '',
            price: 0,
            location: '',
            capacity: 0
        })
    }

    const filteredServices = services?.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#F1F2F8] p-8 lg:p-14">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#05203C]">Manajemen Layanan</h1>
                    <p className="text-slate-500 font-medium">Tambah, edit, atau hapus properti dan layanan dalam sistem.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-4 bg-[#0062E3] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#0052bd] transition-all shadow-lg shadow-[#0062E3]/20"
                >
                    <Plus size={20} />
                    Registrasi Layanan Baru
                </button>
            </header>

            {/* Control Bar */}
            <div className="bg-white p-4 rounded-2xl border shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari lewat nama atau lokasi..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[#0062E3] outline-none font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-[#05203C] font-bold rounded-xl hover:bg-slate-50 transition-all text-sm">
                        <Filter size={18} />
                        Filter
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="p-20 text-center"><Loader className="animate-spin mx-auto text-[#0062E3]" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredServices?.map((service) => (
                            <motion.div
                                key={service.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-3xl border shadow-sm overflow-hidden group hover:shadow-xl transition-all"
                            >
                                <div className="h-56 relative overflow-hidden">
                                    <img src={service.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 bg-[#05203C] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">
                                        {service.category}
                                    </div>
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="p-3 bg-white/90 backdrop-blur text-[#05203C] rounded-xl hover:bg-[#0062E3] hover:text-white transition-all shadow-lg"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteMutation.mutate(service.id)}
                                            className="p-3 bg-white/90 backdrop-blur text-[#05203C] rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-[#05203C] mb-2 line-clamp-1">{service.title}</h3>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                                        <MapPin size={14} className="text-[#0062E3]" />
                                        <span>{service.location}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-6 border-t">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Mulai Dari</p>
                                            <p className="text-2xl font-extrabold text-[#0062E3]">${service.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Kapasitas</p>
                                            <p className="text-xl font-bold text-slate-700">{service.capacity} Orang</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modern Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-[#05203C]/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl p-10 lg:p-14"
                        >
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-[#05203C] mb-2">{editingService ? 'Perbarui Layanan' : 'Tambah Layanan Baru'}</h2>
                                    <p className="text-slate-500">Lengkapi formulir di bawah untuk mendaftarkan layanan.</p>
                                </div>
                                <button onClick={handleCloseModal} className="p-4 bg-slate-100 hover:bg-slate-200 rounded-full transition-all">
                                    <X size={24} className="text-slate-600" />
                                </button>
                            </div>

                            <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Tag size={14} /> Nama Layanan
                                        </label>
                                        <input
                                            type="text" required
                                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0062E3] outline-none font-bold text-[#05203C]"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <MapPin size={14} /> Lokasi
                                        </label>
                                        <input
                                            type="text" required
                                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0062E3] outline-none font-bold text-[#05203C]"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <DollarSign size={14} /> Harga
                                            </label>
                                            <input
                                                type="number" required
                                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0062E3] outline-none font-bold text-[#05203C]"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Users size={14} /> Kapasitas
                                            </label>
                                            <input
                                                type="number" required
                                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0062E3] outline-none font-bold text-[#05203C]"
                                                value={formData.capacity}
                                                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Package size={14} /> Kategori
                                        </label>
                                        <select
                                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0062E3] outline-none font-bold text-[#05203C] appearance-none"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {['Hotel', 'Villa', 'Olahraga', 'Salon', 'Konsultasi'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Upload size={14} /> URL Image
                                        </label>
                                        <input
                                            type="text" required
                                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0062E3] outline-none font-bold text-[#05203C]"
                                            value={formData.image_url}
                                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deskripsi Layanan</label>
                                        <textarea
                                            required rows={4}
                                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#0062E3] outline-none font-medium text-[#05203C]"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-10">
                                    <button
                                        disabled={mutation.isPending}
                                        className="w-full py-5 bg-[#0062E3] text-white rounded-2xl text-xl font-bold flex items-center justify-center gap-3 hover:bg-[#0052bd] transition-all shadow-xl shadow-[#0062E3]/20"
                                    >
                                        {mutation.isPending ? <Loader className="animate-spin" /> : (
                                            <>
                                                <Check size={24} />
                                                Simpan Perubahan Layanan
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ManageServices
