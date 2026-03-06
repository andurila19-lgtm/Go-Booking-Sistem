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
	err = db.AutoMigrate(&models.User{}, &models.Service{}, &models.Booking{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	DB = db

	SeedInitialData(db)
}

func SeedInitialData(db *gorm.DB) {
	var count int64
	db.Model(&models.Service{}).Count(&count)
	if count > 0 {
		return
	}

	mockServices := []models.Service{
		{
			Title:       "Luxury Bali Resort & Spa",
			Description: "Experience pure bliss at our beachfront resort in Jimbaran. Features private pools, world-class dining, and panoramic ocean views.",
			Category:    "Hotel",
			Location:    "Jimbaran, Bali",
			Price:       3500000,
			Capacity:    2,
			ImageURL:    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
		},
		{
			Title:       "Mountain View Villa Yogyakarta",
			Description: "A serene escape nestled in the hills of Yogyakarta. Perfect for families looking for peace and quiet with a stunning view of Merapi.",
			Category:    "Villa",
			Location:    "Sleman, Yogyakarta",
			Price:       1200000,
			Capacity:    6,
			ImageURL:    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
		},
		{
			Title:       "Modern City Center Apartment Jakarta",
			Description: "Stay in the heart of the action. This modern apartment offers high-speed WiFi, gym access, and proximity to major shopping malls.",
			Category:    "Hotel",
			Location:    "Sudirman, Jakarta",
			Price:       850000,
			Capacity:    2,
			ImageURL:    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
		},
		{
			Title:       "Colonial Heritage Boutique Hotel",
			Description: "Discover history in this beautifully restored colonial building. Each room tells a story with antique furniture and modern amenities.",
			Category:    "Hotel",
			Location:    "Bandung, West Java",
			Price:       950000,
			Capacity:    2,
			ImageURL:    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
		},
		{
			Title:       "Grand Executive Villa & Spa Bali",
			Description: "A sophisticated villa with integrated spa treatments and a personal chef at your service throughout your stay.",
			Category:    "Villa",
			Location:    "Uluwatu, Bali",
			Price:       4500000,
			Capacity:    4,
			ImageURL:    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
		},
		{
			Title:       "Kuta Beach Front Hotel",
			Description: "Affordable luxury right on the famous Kuta beach. Watch the sunset from your private balcony.",
			Category:    "Hotel",
			Location:    "Kuta, Bali",
			Price:       750000,
			Capacity:    2,
			ImageURL:    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
		},
	}

	for _, service := range mockServices {
		db.Create(&service)
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
