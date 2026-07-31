export const MYSQL_SCHEMA_SQL = `-- MySQL Schema for NutriGenius AI Food Database
CREATE DATABASE IF NOT EXISTS food_nutrition_db;
USE food_nutrition_db;

CREATE TABLE IF NOT EXISTS food_items (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  calories INT NOT NULL,
  protein FLOAT NOT NULL,
  carbohydrates FLOAT NOT NULL,
  fat FLOAT NOT NULL,
  fiber FLOAT DEFAULT 0,
  sugar FLOAT DEFAULT 0,
  sodium FLOAT DEFAULT 0,
  cholesterol FLOAT DEFAULT 0,
  description TEXT,
  cuisine VARCHAR(100),
  meal_type VARCHAR(100),
  healthy_rating INT DEFAULT 3,
  views INT DEFAULT 0,
  is_favorite BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'Available',
  created_at DATETIME,
  updated_at DATETIME,
  barcode VARCHAR(64),
  image_url VARCHAR(512)
);
`;

export const SPRING_BOOT_ENTITY_CODE = `package com.nutrigenius.ai.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "food_items")
public class FoodItem {
    @Id
    private String id;
    private String name;
    private String category;
    private Integer calories;
    private Double protein;
    private Double carbohydrates;
    private Double fat;
    private Double fiber;
    private Double sugar;
    private Double sodium;
    private Double cholesterol;
    
    @Column(length = 1000)
    private String description;
    private String cuisine;
    private String mealType;
    private Integer healthyRating;
    private Integer views;
    private Boolean isFavorite;
    private String status;
    private String barcode;
    private String imageUrl;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }
    public Double getProtein() { return protein; }
    public void setProtein(Double protein) { this.protein = protein; }
    public Double getCarbohydrates() { return carbohydrates; }
    public void setCarbohydrates(Double carbohydrates) { this.carbohydrates = carbohydrates; }
    public Double getFat() { return fat; }
    public void setFat(Double fat) { this.fat = fat; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
`;

export const SPRING_BOOT_CONTROLLER_CODE = `package com.nutrigenius.ai.controller;

import com.nutrigenius.ai.entity.FoodItem;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodController {

    private final List<FoodItem> foodList = new ArrayList<>();

    @GetMapping
    public List<FoodItem> getAllFoods() {
        return foodList;
    }

    @PostMapping
    public FoodItem createFood(@RequestBody FoodItem foodItem) {
        foodList.add(foodItem);
        return foodItem;
    }

    @GetMapping("/{id}")
    public FoodItem getFoodById(@PathVariable String id) {
        return foodList.stream()
                .filter(f -> f.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteFood(@PathVariable String id) {
        foodList.removeIf(f -> f.getId().equals(id));
    }
}
`;
