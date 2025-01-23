package com.vlotech.javabackend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;

@Table(name = "products")
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "link", nullable = false)
    private String link;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "brand")
    private String brand;

    @Column(name = "product_code", unique = true)
    private String productCode;

    @Column(name = "availability", nullable = false)
    private String availability;

    @Column(name = "category", nullable = false)
    private String category;

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLink() {
        return link;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getBrand() {
        return brand;
    }

    public String getProductCode() {
        return productCode;
    }

    public String getAvailability() {
        return availability;
    }

    public String getCategory() {
        return category;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    // Getters and setters
}

