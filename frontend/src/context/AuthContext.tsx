import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { User } from '../types'

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    phoneLogin: (phone: string, otp: string) => Promise<void>;
    socialLogin: (provider: string, data: any) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api'

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        try {
            const res = await axios.get<User>('/api/user')
            setUser(res.data)
        } catch (err) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const res = await axios.post<{ user: User, message: string }>('/api/login', { email, password })
            setUser(res.data.user)
            navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard')
        } catch (err: any) {
            throw err
        }
    }

    const phoneLogin = async (phone: string, otp: string): Promise<void> => {
        try {
            const res = await axios.post<{ user: User, message: string }>('/api/phone-login', { phone, otp })
            setUser(res.data.user)
            navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard')
        } catch (err: any) {
            throw err
        }
    }

    const socialLogin = async (provider: string, data: any): Promise<void> => {
        try {
            const res = await axios.post<{ user: User, message: string }>('/api/social-login', { ...data, provider })
            setUser(res.data.user)
            navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard')
        } catch (err: any) {
            throw err
        }
    }

    const register = async (name: string, email: string, password: string): Promise<void> => {
        try {
            await axios.post('/api/register', { name, email, password })
            navigate('/login')
        } catch (err: any) {
            throw err
        }
    }

    const logout = async () => {
        await axios.post('/api/logout')
        setUser(null)
        navigate('/')
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, phoneLogin, socialLogin, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must