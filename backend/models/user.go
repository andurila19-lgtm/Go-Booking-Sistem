package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	Name       string         `json:"name"`
	Email      *string        `gorm:"uniqueIndex" json:"email"`
	Phone      *string        `gorm:"uniqueIndex" json:"phone"`
	Password   string         `json:"-"`
	Role       string         `gorm:"default:'customer'" json:"role"`  // customer, admin
	Provider   string         `gorm:"default:'local'" json:"provider"` // local, google, apple, phone
	ProviderID string         `json:"provider_id"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}
