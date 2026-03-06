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

	// Simple check for availability: only one booking per service per day
	// In a real app, this should be more complex (time slots, capacity)
	var existing models.Booking
	database.DB.Where("service_id = ? AND booking_date = ? AND status != 'cancelled'", booking.ServiceID, booking.BookingDate.Format("2006-01-02")).First(&existing)

	if existing.ID != 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Service is already booked for this date",
		})
	}

	database.DB.Create(&booking)
	return c.JSON(booking)
}

func GetAllBookings(c *fiber.Ctx) error {
	var bookings []models.Booking
	database.DB.Preload("User").Preload("Service").Find(&bookings)
	return c.JSON(bookings)
}

func GetUserBookings(c *fiber.Ctx) error {
	userId := c.Locals("user_id").(string)
	var bookings []models.Booking
	database.DB.Preload("Service").Where("user_id = ?", userId).Find(&bookings)
	return c.JSON(bookings)
}

func UpdateBookingStatus(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var booking models.Booking
	database.DB.First(&booking, id)
	booking.Status = data["status"]
	database.DB.Save(&booking)

	return c.JSON(booking)
}
