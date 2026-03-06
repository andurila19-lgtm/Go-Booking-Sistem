package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/username/go-booking-system/backend/database"
	"github.com/username/go-booking-system/backend/models"
)

func CreateBooking(c *fiber.Ctx) error {
	var booking models.Booking
	if err := c.BodyParser(&booking); err != nil {
		return err
	}

	// Validate stay dates
	if booking.CheckOutDate.Before(booking.CheckInDate) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Check-out date must be after check-in date",
		})
	}

	// 20. Fitur pencegahan double booking
	var existing models.Booking
	database.DB.Where("room_id = ? AND status != 'cancelled' AND ((check_in_date <= ? AND check_out_date > ?) OR (check_in_date < ? AND check_out_date >= ?) OR (? <= check_in_date AND ? > check_in_date))",
		booking.RoomID, booking.CheckInDate, booking.CheckInDate, booking.CheckOutDate, booking.CheckOutDate, booking.CheckInDate, booking.CheckOutDate).First(&existing)

	if existing.ID != 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Room is already booked for these dates",
		})
	}

	// Calculate totals
	var room models.Room
	database.DB.First(&room, booking.RoomID)
	if room.ID == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Room not found",
		})
	}

	days := int(booking.CheckOutDate.Sub(booking.CheckInDate).Hours() / 24)
	if days == 0 {
		days = 1
	}

	booking.TotalNights = days
	booking.UnitPrice = room.Price
	booking.TotalPrice = float64(days) * room.Price
	booking.Tax = booking.TotalPrice * 0.11        // 11% PPN
	booking.ServiceFee = booking.TotalPrice * 0.05 // 5% Service
	booking.GrandTotal = booking.TotalPrice + booking.Tax + booking.ServiceFee
	booking.Status = "pending"

	database.DB.Create(&booking)
	return c.JSON(booking)
}

func GetAllBookings(c *fiber.Ctx) error {
	var bookings []models.Booking
	database.DB.Preload("User").Preload("Room.Hotel").Find(&bookings)
	return c.JSON(bookings)
}

func GetUserBookings(c *fiber.Ctx) error {
	userId := c.Locals("user_id") // Should be set by auth middleware
	var bookings []models.Booking
	database.DB.Preload("Room.Hotel").Where("user_id = ?", userId).Find(&bookings)
	return c.JSON(bookings)
}

func UpdateBookingStatus(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var booking models.Booking
	if err := database.DB.First(&booking, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "Booking not found"})
	}

	booking.Status = data["status"]
	database.DB.Save(&booking)

	return c.JSON(booking)
}
