package com.vlotech.javabackend.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "delivery_options")
public class DeliveryOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "method", nullable = false)
    private String method; // e.g., "Standard", "Express", "Same-day"

    @Column(name = "cost", nullable = false)
    private BigDecimal cost;

    @OneToMany(mappedBy = "deliveryOption")
    private List<Order> orders;

    public Long getId() {
        return id;
    }

    public String getMethod() {
        return method;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
}