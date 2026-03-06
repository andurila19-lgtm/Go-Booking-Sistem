package handlers

import (
	"context"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/username/go-booking-system/backend/database"
	"github.com/username/go-booking-system/backend/models"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/idtoken"
)

func ptr(s string) *string {
	return &s
}

func Register(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	email := data["email"]
	if email == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Email is required",
		})
	}

	// Check if user exists
	var existingUser models.User
	database.DB.Where("email = ?", email).First(&existingUser)
	if existingUser.ID != 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "User already exists",
		})
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	user := models.User{
		Name:     data["name"],
		Email:    ptr(email),
		Password: string(password),
		Role:     "customer",
		Provider: "local",
	}

	database.DB.Create(&user)

	return c.JSON(user)
}

func Login(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	if user.ID == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "User not found",
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data["password"])); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Incorrect password",
		})
	}

	return generateTokenAndCookie(c, user)
}

func SocialLogin(c *fiber.Ctx) error {
	var data struct {
		Provider string `json:"provider"`
		Token    string `json:"token"`
		// Fallback for simulation/testing
		Name       string `json:"name"`
		Email      string `json:"email"`
		ProviderID string `json:"provider_id"`
	}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User
	var email, name, providerID string

	if data.Provider == "google" && data.Token != "" {
		// Verify Google Token
		payload, err := idtoken.Validate(context.Background(), data.Token, os.Getenv("GOOGLE_CLIENT_ID"))
		if err != nil {
			// If validation fails (e.g. invalid client ID in .env), we might want to log it
			// For this task, we will allow it to proceed if it's a "simulation" token or ignore error for local dev if needed
			// But let's be strict for real implementation
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Invalid Google token",
			})
		}
		email = payload.Claims["email"].(string)
		name = payload.Claims["name"].(string)
		providerID = payload.Subject
	} else {
		// Simulation or other providers (Apple)
		email = data.Email
		name = data.Name
		providerID = data.ProviderID
	}

	database.DB.Where("email = ? OR (provider = ? AND provider_id = ?)", email, data.Provider, providerID).First(&user)

	if user.ID == 0 {
		user = models.User{
			Name:       name,
			Email:      ptr(email),
			Provider:   data.Provider,
			ProviderID: providerID,
			Role:       "customer",
		}
		database.DB.Create(&user)
	}

	return generateTokenAndCookie(c, user)
}

func PhoneLogin(c *fiber.Ctx) error {
	var data struct {
		Phone string `json:"phone"`
		OTP   string `json:"otp"` // In production, verify this
	}

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	// Dummy OTP verification: assume '123456' is correct
	if data.OTP != "123456" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid OTP. Use 123456 for testing.",
		})
	}

	var user models.User
	database.DB.Where("phone = ?", data.Phone).First(&user)

	if user.ID == 0 {
		user = models.User{
			Name:     "User " + data.Phone[len(data.Phone)-4:],
			Phone:    ptr(data.Phone),
			Role:     "customer",
			Provider: "phone",
		}
		database.DB.Create(&user)
	}

	return generateTokenAndCookie(c, user)
}

func generateTokenAndCookie(c *fiber.Ctx, user models.User) error {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not login",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
		Secure:   false, // Set to true if using HTTPS
		SameSite: "Lax",
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Success",
		"user":    user,
		"token":   token,
	})
}

func User(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	token, _ := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User

	database.DB.Where("id = ?", claims.Issuer).First(&user)

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Success",
	})
}
