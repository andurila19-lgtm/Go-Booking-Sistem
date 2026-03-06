export interface User {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    role: 'customer' | 'admin';
    provider: string;
    created_at: string;
}

export interface Hotel {
    id: number;
    name: string;
    description: string;
    location: string;
    city: string;
    address: string;
    rating: number;
    facilities: string;
    image_url: string;
    type: 'hotel' | 'villa';
    price_start: number;
    rooms?: Room[];
    created_at: string;
}

export interface Room {
    id: number;
    hotel_id: number;
    room_number: string;
    type: string;
    description: string;
    capacity: number;
    price: number;
    is_available: boolean;
    image_url: string;
    created_at: string;
}

export interface Booking {
    id: number;
    user_id: number;
    user?: User;
    hotel_id: number;
    room_id: number;
    room?: Room;
    check_in_date: string;
    check_out_date: string;
    total_nights: number;
    unit_price: number;
    total_price: number;
    tax: number;
    service_fee: number;
    grand_total: number;
    status: 'pending' | 'paid' | 'cancelled' | 'completed';
    payment_method: string;
    created_at: string;
}
