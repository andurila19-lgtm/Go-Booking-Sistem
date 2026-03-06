package models

import (
	"time"

	"gorm.io/gorm"
)

type Booking struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	UserID      uint           `json:"user_id"`
	User        User           `json:"user" gorm:"foreignKey:UserID"`
	ServiceID   uint           `json:"service_id"`
	Service     Service        `json:"service" gorm:"foreignKey:ServiceID"`
	BookingDate time.Time      `json:"booking_date"`
	Status      string         `gorm:"default:'pending'" json:"status"` // pending, confirmed, cancelled
	Notes       string         `json:"notes"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
