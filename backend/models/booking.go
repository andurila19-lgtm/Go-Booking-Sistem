package models

import (
	"time"

	"gorm.io/gorm"
)

type Booking struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	UserID        uint           `json:"user_id" binding:"required"`
	HotelID       uint           `json:"hotel_id" binding:"required"`
	RoomID        uint           `json:"room_id" binding:"required"`
	CheckInDate   time.Time      `json:"check_in_date" binding:"required"`
	CheckOutDate  time.Time      `json:"check_out_date" binding:"required"`
	TotalNights   int            `json:"total_nights"`
	UnitPrice     float64        `json:"unit_price"`                      // Price per night in IDR
	TotalPrice    float64        `json:"total_price"`                     // total_nights * unit_price
	Tax           float64        `json:"tax"`                             // E.g. 11%
	ServiceFee    float64        `json:"service_fee"`                     // E.g. 5%
	GrandTotal    float64        `json:"grand_total"`                     // TotalPrice + Tax + ServiceFee
	Status        string         `gorm:"default:'pending'" json:"status"` // pending, paid, cancelled, completed
	PaymentMethod string         `json:"payment_method"`                  // bank_transfer, e_wallet, pay_at_hotel
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
	User          User           `gorm:"foreignKey:UserID" json:"user"`
	Room          Room           `gorm:"foreignKey:RoomID" json:"room"`
}
