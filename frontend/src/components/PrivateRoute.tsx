import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface PrivateRouteProps {
    role?: 'customer' | 'admin';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ role }) => {
    const { user } = useAuth()

    if (!user) return <Navigate to="/login" />
    if (role && user.role !== role) return <Navigate to="/" />

    return <Outlet />
}

export default PrivateRoute
