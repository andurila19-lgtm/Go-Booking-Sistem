package models

import (
	"time"

	"gorm.io/gorm"
)

type Room struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	HotelID     uint           `json:"hotel_id" binding:"required"`
	RoomNumber  string         `json:"room_number"`
	Type        string         `json:"type" binding:"required"` // deluxe, superior, standard, suite
	Description string         `json:"description"`
	Capacity    int            `gorm:"default:2" json:"capacity"`
	Price       float64        `json:"price" binding:"required"` // Price per night in IDR
	IsAvailable bool           `gorm:"default:true" json:"is_available"`
	ImageURL    string         `json:"image_url"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
