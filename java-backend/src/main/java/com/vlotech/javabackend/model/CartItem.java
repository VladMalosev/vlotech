package com.vlotech.javabackend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;

@Table(name = "cart_items")
@Entity
public class CartItem {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;



    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }


    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }



    public String getId()
    {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
        this.unitPrice = product.getPrice();  // Assuming product has a price field
        this.totalPrice = product.getPrice().multiply(BigDecimal.valueOf(quantity));
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }


}
