package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/username/go-booking-system/backend/database"
	"github.com/username/go-booking-system/backend/models"
)

// List Hotels/Villas (Fitur 2 & 3)
func GetAllHotels(c *fiber.Ctx) error {
	var hotels []models.Hotel
	query := database.DB.Model(&models.Hotel{})

	// Filter by search keyword (Fitur 2)
	if search := c.Query("search"); search != "" {
		query = query.Where("name ILIKE ? OR location ILIKE ? OR city ILIKE ?", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	// Filter by location (Fitur 3)
	if location := c.Query("location"); location != "" {
		query = query.Where("location ILIKE ? OR city ILIKE ?", "%"+location+"%", "%"+location+"%")
	}

	// Filter by type (Fitur 3)
	if hotelType := c.Query("type"); hotelType != "" {
		query = query.Where("type = ?", hotelType)
	}

	// Filter by price range (Fitur 3)
	if minPrice := c.Query("min_price"); minPrice != "" {
		val, _ := strconv.ParseFloat(minPrice, 64)
		query = query.Where("price_start >= ?", val)
	}
	if maxPrice := c.Query("max_price"); maxPrice != "" {
		val, _ := strconv.ParseFloat(maxPrice, 64)
		query = query.Where("price_start <= ?", val)
	}

	query.Find(&hotels)
	return c.JSON(hotels)
}

// Hotel Details (Fitur 4)
func GetHotel(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	var hotel models.Hotel
	if err := database.DB.Preload("Rooms").First(&hotel, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "Hotel not found"})
	}
	return c.JSON(hotel)
}

// Room Listing for a Hotel (Fitur 5)
func GetHotelRooms(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	var rooms []models.Room
	database.DB.Where("hotel_id = ? AND is_available = ?", id, true).Find(&rooms)
	return c.JSON(rooms)
}

// Add/Update Hotel (Fitur 15 Admin)
func CreateHotel(c *fiber.Ctx) error {
	var hotel models.Hotel
	if err := c.BodyParser(&hotel); err != nil {
		return err
	}
	database.DB.Create(&hotel)
	return c.JSON(hotel)
}

func UpdateHotel(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	var hotel models.Hotel
	database.DB.First(&hotel, id)
	if err := c.BodyParser(&hotel); err != nil {
		return err
	}
	database.DB.Save(&hotel)
	return c.JSON(hotel)
}

// Add Room (Fitur 16 Admin)
func CreateRoom(c *fiber.Ctx) error {
	var room models.Room
	if err := c.BodyParser(&room); err != nil {
		return err
	}
	database.DB.Create(&room)
	return c.JSON(room)
}

// Get Room Detailed info
func GetRoom(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	var room models.Room
	if err := database.DB.First(&room, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "Room not found"})
	}
	return c.JSON(room)
}
