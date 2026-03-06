package database

import (
	"fmt"
	"log"
	"os"

	"github.com/username/go-booking-system/backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ptr(s string) *string {
	return &s
}

var DB *gorm.DB

func ConnectDB() {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_SSLMODE"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	fmt.Println("Database connection established")

	// Auto Migration
	err = db.AutoMigrate(&models.User{}, &models.Hotel{}, &models.Room{}, &models.Booking{}, &models.Review{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	DB = db

	SeedInitialData(db)
}

func SeedInitialData(db *gorm.DB) {
	var count int64
	db.Model(&models.Hotel{}).Count(&count)
	if count > 0 {
		return
	}

	mockHotels := []models.Hotel{
		{
			Name:        "Luxury Bali Resort & Spa",
			Description: "Experience pure bliss at our beachfront resort in Jimbaran. Features private pools, world-class dining, and panoramic ocean views.",
			Location:    "Jimbaran, Bali",
			City:        "Bali",
			Address:     "Jl. Pantai Muaya, Jimbaran",
			Rating:      4.9,
			Facilities:  "Swimming Pool, Spa, Gym, Restaurant, WiFi",
			ImageURL:    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
			Type:        "hotel",
			PriceStart:  3500000,
		},
		{
			Name:        "Mountain View Villa Yogyakarta",
			Description: "A serene escape nestled in the hills of Yogyakarta. Perfect for families looking for peace and quiet with a stunning view of Merapi.",
			Location:    "Sleman, Yogyakarta",
			City:        "Yogyakarta",
			Address:     "Jl. Kaliurang KM 20, Sleman",
			Rating:      4.7,
			Facilities:  "Private Pool, Kitchen, WiFi, Garden, Parking",
			ImageURL:    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
			Type:        "villa",
			PriceStart:  1200000,
		},
		{
			Name:        "Modern City Center Hotel Jakarta",
			Description: "Stay in the heart of the action. This modern hotel offers high-speed WiFi, gym access, and proximity to major shopping malls.",
			Location:    "Sudirman, Jakarta",
			City:        "Jakarta",
			Address:     "Jl. Jend. Sudirman No. 21, Jakarta Pusat",
			Rating:      4.5,
			Facilities:  "WiFi, Gym, Bar, meeting Room, Restaurant",
			ImageURL:    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
			Type:        "hotel",
			PriceStart:  850000,
		},
	}

	for _, hotel := range mockHotels {
		db.Create(&hotel)

		// Seed Rooms for each hotel
		rooms := []models.Room{
			{
				HotelID:    hotel.ID,
				Type:       "Deluxe Room",
				RoomNumber: "101",
				Price:      hotel.PriceStart,
				Capacity:   2,
				ImageURL:   hotel.ImageURL,
			},
			{
				HotelID:    hotel.ID,
				Type:       "Superior Room",
				RoomNumber: "201",
				Price:      hotel.PriceStart + 500000,
				Capacity:   2,
				ImageURL:   "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
			},
		}
		for _, room := range rooms {
			db.Create(&room)
		}
	}

	// Seed Admin User
	var adminCount int64
	db.Model(&models.User{}).Where("role = ?", "admin").Count(&adminCount)
	if adminCount == 0 {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), 14)
		admin := models.User{
			Name:     "Admin Bookify",
			Email:    ptr("admin@bookify.id"),
			Password: string(hashedPassword),
			Role:     "admin",
		}
		db.Create(&admin)
		fmt.Println("Admin user seeded: admin@bookify.id / admin123")
	}

	fmt.Println("Initial mock data seeded successfully")
}
