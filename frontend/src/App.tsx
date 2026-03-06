import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Search from './pages/Search'
import ServiceDetail from './pages/ServiceDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ManageServices from './pages/ManageServices'
import ManageBookings from './pages/ManageBookings'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

const App: React.FC = () => {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/service/:id" element={<ServiceDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* User Routes */}
                        <Route element={<PrivateRoute role="customer" />}>
                            <Route path="/dashboard" element={<UserDashboard />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route element={<PrivateRoute role="admin" />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/services" element={<ManageServices />} />
                            <Route path="/admin/bookings" element={<ManageBookings />} />
                        </Route>
                    </Routes>
                </main>
                <Footer />
            </div>
        </AuthProvider>
    )
}

export default App
