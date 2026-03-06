import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Calendar, User, LogOut, Menu, X } from 'lucide-react'

const Navbar: React.FC = () => {
    const { user, logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="glass sticky top-0 z-50 py-4 px-6 border-b">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
                    <Calendar className="w-8 h-8" />
                    <span>Bookify</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link to="/search" className="text-slate-600 hover:text-primary-600">Find Services</Link>
                    {user ? (
                        <div className="flex items-center gap-4 border-l pl-8 ml-4">
                            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">{user.name}</Link>
                            <button
                                onClick={logout}
                                className="text-slate-500 hover:text-red-500 text-sm bg-white border px-3 py-1.5 rounded-full"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-slate-600 font-medium">Login</Link>
                            <Link to="/register" className="btn-primary">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
