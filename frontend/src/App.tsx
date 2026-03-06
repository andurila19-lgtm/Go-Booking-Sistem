import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Search from './pages/Search'
import HotelDetail from './pages/HotelDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ManageHotels from './pages/ManageHotels'
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
                        <Route path="/hotel/:id" element={<HotelDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* User Routes */}
                        <Route element={<PrivateRoute role="customer" />}>
                            <Route path="/dashboard" element={<UserDashboard />} />
                        </Route>

                        {/* Admin Routes */}
                        <Route element={<PrivateRoute role="admin" />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/hotels" element={<ManageHotels />} />
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
