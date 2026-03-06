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

	// Services
	api.Get("/services", handlers.GetAllServices)
	api.Get("/services/:id", handlers.GetService)
	api.Post("/services", middleware.IsAuthenticated, handlers.CreateService)
	api.Put("/services/:id", middleware.IsAuthenticated, handlers.UpdateService)
	api.Delete("/services/:id", middleware.IsAuthenticated, handlers.DeleteService)

	// Bookings
	api.Post("/bookings", middleware.IsAuthenticated, handlers.CreateBooking)
	api.Get("/bookings", middleware.IsAuthenticated, handlers.GetAllBookings)
	api.Get("/my-bookings", middleware.IsAuthenticated, handlers.GetUserBookings)
	api.Put("/bookings/:id", middleware.IsAuthenticated, handlers.UpdateBookingStatus)
}
