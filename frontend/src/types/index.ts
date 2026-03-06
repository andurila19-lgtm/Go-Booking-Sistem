export interface User {
    id: number;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    created_at: string;
}

export interface Service {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    location: string;
    image_url: string;
    capacity: number;
    created_at: string;
}

export interface Booking {
    id: number;
    user_id: number;
    user: User;
    service_id: number;
    service: Service;
    booking_date: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    notes?: string;
    created_at: string;
}
