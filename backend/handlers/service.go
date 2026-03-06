package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/username/go-booking-system/backend/database"
	"github.com/username/go-booking-system/backend/models"
)

func GetAllServices(c *fiber.Ctx) error {
	var services []models.Service
	database.DB.Find(&services)
	return c.JSON(services)
}

func GetService(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	var service models.Service
	database.DB.Where("id = ?", id).First(&service)
	return c.JSON(service)
}

func CreateService(c *fiber.Ctx) error {
	var service models.Service
	if err := c.BodyParser(&service); err != nil {
		return err
	}

	database.DB.Create(&service)
	return c.JSON(service)
}

func UpdateService(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	var service models.Service
	service.ID = uint(id)

	if err := c.BodyParser(&service); err != nil {
		return err
	}

	database.DB.Model(&service).Updates(service)
	return c.JSON(service)
}

func DeleteService(c *fiber.Ctx) error {
	id, _ := strconv.Atoi(c.Params("id"))
	database.DB.Delete(&models.Service{}, id)
	return c.JSON(fiber.Map{
		"message": "Service successfully deleted",
	})
}
