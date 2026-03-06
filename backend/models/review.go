package models

import (
	"time"

	"gorm.io/gorm"
)

type Review struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `json:"user_id" binding:"required"`
	HotelID   uint           `json:"hotel_id" binding:"required"`
	BookingID uint           `json:"booking_id" binding:"required"`
	Rating    int            `gorm:"default:5" json:"rating" binding:"required"` // 1-5 stars
	Comment   string         `json:"comment"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	User      User           `gorm:"foreignKey:UserID" json:"user"`
}
