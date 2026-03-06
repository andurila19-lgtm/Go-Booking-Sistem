package models

import (
	"time"

	"gorm.io/gorm"
)

type Service struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `json:"title"`
	Description string         `json:"description"`
	Category    string         `json:"category"` // hotel, villa, sports, etc.
	Price       float64        `json:"price"`
	Location    string         `json:"location"`
	ImageURL    string         `json:"image_url"`
	Capacity    int            `json:"capacity"`
	CreatedBy   uint           `json:"created_by"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}
