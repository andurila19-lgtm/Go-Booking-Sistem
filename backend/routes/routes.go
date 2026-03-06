package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/username/go-booking-system/backend/handlers"
	"github.com/username/go-booking-system/backend/middleware"
)

func Setup(app *fiber.App) {
	api := app.Group("/api")

	// Auth
	api.Post("/register", handlers.Register)
	api.Post("/login", handlers.Login)
	api.Post("/social-login", handlers.SocialLogin)
	api.Post("/phone-login", handlers.PhoneLogin)
	api.Post("/logout", handlers.Logout)
	api.Get("/user", middleware.IsAuthenticated, handlers.User)

	// Hotels & Villas (Fitur 1-5, 15)
	api.Get("/hotels", handlers.GetAllHotels)
	api.Get("/hotels/:id", handlers.GetHotel)
	api.Get("/hotels/:id/rooms", handlers.GetHotelRooms)
	api.Post("/hotels", middleware.IsAuthenticated, handlers.CreateHotel)
	api.Put("/hotels/:id", middleware.IsAuthenticated, handlers.UpdateHotel)

	// Rooms (Fitur 16)
	api.Get("/rooms/:id", handlers.GetRoom)
	api.Post("/rooms", middleware.IsAuthenticated, handlers.CreateRoom)

	// Bookings (Fitur 6, 8, 10, 11, 14, 18, 19, 20)
	api.Post("/bookings", middleware.IsAuthenticated, handlers.CreateBooking)
	api.Get("/bookings", middleware.IsAuthenticated, handlers.GetAllBookings)
	api.Get("/my-bookings", middleware.IsAuthenticated, handlers.GetUserBookings)
	api.Put("/bookings/:id", middleware.IsAuthenticated, handlers.UpdateBookingStatus)
}
