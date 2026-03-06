import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Mail, Lock, Loader, ArrowRight, Phone, Apple } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'

const Login: React.FC = () => {
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { login, phoneLogin, socialLogin } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            if (loginMethod === 'email') {
                await login(email, password)
            } else {
                if (!otpSent) {
                    setOtpSent(true)
                    setLoading(false)
                    return
                }
                await phoneLogin(phone, otp)
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true)
        try {
            await socialLogin('google', {
                token: credentialResponse.credential
            })
        } catch (err: any) {
            setError('Google login failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F2F8] p-6 pt-24 pb-20">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[32px] shadow-2xl p-10 border border-slate-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0062E3]/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                    <div className="text-center mb-10 relative">
                        <h1 className="text-3xl font-extrabold text-[#05203C] mb-2 tracking-tight">Selamat Datang</h1>
                        <p className="text-slate-400 font-medium italic">Pilih metode masuk ternyaman Anda</p>
                    </div>

                    <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8 border border-slate-100">
                        <button
                            onClick={() => setLoginMethod('email')}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${loginMethod === 'email' ? 'bg-white text-[#0062E3] shadow-lg shadow-black/5' : 'text-slate-400'}`}
                        >
                            Email & Password
                        </button>
                        <button
                            onClick={() => setLoginMethod('phone')}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${loginMethod === 'phone' ? 'bg-white text-[#0062E3] shadow-lg shadow-black/5' : 'text-slate-400'}`}
                        >
                            Nomor Telepon
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl mb-6 text-xs font-bold flex items-center gap-3"
                        >
                            <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        <AnimatePresence mode="wait">
                            {loginMethod === 'email' ? (
                                <motion.div
                                    key="email"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
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
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0062E3] transition-colors" size={18} />
                                            <input
                                                type="password"
                                                required
                                                placeholder="••••••••"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#0062E3] focus:bg-white outline-none transition-all font-medium text-[#05203C]"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="phone"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Nomor Telepon</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0062E3] transition-colors" size={18} />
                                            <input
                                                type="tel"
                                                required
                                                disabled={otpSent}
                                                placeholder="+62 812 XXXX"
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-[#0062E3] focus:bg-white outline-none transition-all font-medium text-[#05203C]"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {otpSent && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                        >
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Kode OTP (Test: 123456)</label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    required
                                                    autoFocus
                                                    placeholder="6 Digit OTP"
                                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-[#0062E3]/20 rounded-2xl focus:border-[#0062E3] focus:bg-white outline-none transition-all font-bold tracking-[1em] text-center text-xl text-[#05203C]"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-2 text-center uppercase tracking-widest font-bold">Kirim ulang dalam <span className="text-[#0062E3]">00:59</span></p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-5 rounded-[20px] flex items-center justify-center gap-3 font-extrabold text-lg shadow-xl shadow-[#0062E3]/20 group"
                        >
                            {loading ? <Loader className="animate-spin" size={24} /> : (otpSent ? 'Verifikasi & Masuk' : 'Lanjutkan')}
                            {!loading && (
                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                    <ArrowRight size={22} />
                                </motion.div>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 mb-8 flex items-center gap-4">
                        <div className="h-px bg-slate-100 flex-1" />
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Atau Masuk Dengan</span>
                        <div className="h-px bg-slate-100 flex-1" />
                    </div>

                    <div className="flex flex-col gap-4 items-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google login failed.')}
                            useOneTap
                            theme="outline"
                            size="large"
                            width="100%"
                        />

                        <div className="grid grid-cols-1 w-full gap-4">
                            <button
                                className="py-4 bg-white border-2 border-slate-50 rounded-2xl flex items-center justify-center hover:border-slate-100 transition-all hover:bg-slate-50 group gap-4 px-6 md:px-10"
                            >
                                <Apple size={22} className="text-black group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-bold text-slate-700">Masuk dengan Apple</span>
                            </button>
                        </div>
                    </div>

                    <p className="text-center mt-12 text-sm font-medium text-slate-400">
                        Belum punya akun? <Link to="/register" className="text-[#0062E3] font-bold hover:underline underline-offset-4">Daftar Sekarang</Link>
                    </p>
                </motion.div>

                <p className="text-center mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                    Skyscanner • Secure Cloud Infrastructure
                </p>
            </div>
        </div>
    )
}

export default Login
