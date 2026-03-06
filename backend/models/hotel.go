package models

import (
	"time"

	"gorm.io/gorm"
)

type Hotel struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Name        string         `json:"name" binding:"required"`
	Description string         `json:"description"`
	Location    string         `json:"location" binding:"required"`
	City        string         `json:"city" binding:"required"`
	Address     string         `json:"address"`
	Rating      float64        `gorm:"default:0" json:"rating"`
	Facilities  string         `json:"facilities"` // Comma-separated or JSON string
	ImageURL    string         `json:"image_url"`
	Type        string         `gorm:"default:'hotel'" json:"type"` // hotel, villa
	PriceStart  float64        `json:"price_start"`                 // Minimum price in IDR
	Rooms       []Room         `gorm:"foreignKey:HotelID" json:"rooms"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
