import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Mail, Lock, User, Loader, ArrowRight, Phone, Chrome as Google, Apple, Github } from 'lucide-react'
import { motion } from 'framer-motion'

const Register: React.FC = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { register, socialLogin } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await register(name, email, password)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed.')
        } finally {
            setLoading(false)
        }
    }

    const handleSocialLogin = async (provider: string) => {
        setLoading(true)
        try {
            await socialLogin(provider, {
                email: `${provider}_user@example.com`,
                name: `New ${provider} User`,
                provider_id: Math.random().toString(36).substring(7)
            })
        } catch (err: any) {
            setError(`${provider} signup failed.`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F2F8] p-6 pt-24 pb-20">
            <div className="w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[40px] shadow-2xl p-12 border border-slate-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#0062E3]/5 rounded-full -ml-16 -mt-16 blur-3xl" />

                    <div className="text-center mb-10 relative">
                        <h1 className="text-4xl font-extrabold text-[#05203C] mb-2 tracking-tight">Buat Akun</h1>
                        <p className="text-slate-400 font-medium italic">Mulai perjalanan luar biasa Anda hari ini</p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl mb-8 text-xs font-bold flex items-center gap-3">
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0062E3] transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#0062E3] focus:bg-white outline-none transition-all font-medium text-[#05203C]"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0062E3] transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="contoh@web.id"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#0062E3] focus:bg-white outline-none transition-all font-medium text-[#05203C]"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Telepon (Opsional)</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0062E3] transition-colors" size={18} />
                                    <input
                                        type="tel"
                                        placeholder="+62 812..."
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#0062E3] focus:bg-white outline-none transition-all font-medium text-[#05203C]"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0062E3] transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="Min. 8 Karakter"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#0062E3] focus:bg-white outline-none transition-all font-medium text-[#05203C]"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-5 rounded-[22px] flex items-center justify-center gap-3 font-extrabold text-lg shadow-xl shadow-[#0062E3]/20 transition-all hover:scale-[1.02]"
                        >
                            {loading ? <Loader className="animate-spin" size={24} /> : 'Buat Akun Baru'}
                            {!loading && (
                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                    <ArrowRight size={22} />
                                </motion.div>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 flex items-center gap-4">
                        <div className="h-px bg-slate-100 flex-1" />
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-2">Daftar Lebih Cepat Dengan</span>
                        <div className="h-px bg-slate-100 flex-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-8">
                        {[
                            { id: 'google', icon: Google, color: 'text-[#EA4335]' },
                            { id: 'apple', icon: Apple, color: 'text-black' }
                        ].map((social) => (
                            <button
                                key={social.id}
                                onClick={() => handleSocialLogin(social.id)}
                                className="py-4 bg-white border-2 border-slate-50 rounded-2xl flex items-center justify-center hover:border-slate-200 transition-all hover:bg-slate-50 group"
                            >
                                <social.icon size={24} className={`${social.color} group-hover:scale-110 transition-transform`} />
                            </button>
                        ))}
                    </div>

                    <p className="text-center mt-12 text-sm font-medium text-slate-400">
                        Sudah punya akun? <Link to="/login" className="text-[#0062E3] font-bold hover:underline underline-offset-8">Masuk ke Sini</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default Register
