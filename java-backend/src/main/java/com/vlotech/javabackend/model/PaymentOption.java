package com.vlotech.javabackend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "payment_options")
public class PaymentOption {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "card_number", length = 512, nullable = false)
    private String encryptedCardNumber;

    @Column(name = "card_holder_name", length = 100, nullable = false)
    private String cardHolderName;

    @Column(name = "expiry_date", nullable = false)
    private String expiryDate;

    @Column(name = "card_type", nullable = false)
    private String cardType; // e.g., "VISA", "Mastercard"

    @Column(name = "is_primary", nullable = false)
    private boolean isPrimary;

    public void setCardNumber(String cardNumber) {
        this.encryptedCardNumber = cardNumber;
    }

    public String getCardNumber() {
        return encryptedCardNumber;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setEncryptedCardNumber(String encryptedCardNumber) {
        this.encryptedCardNumber = encryptedCardNumber;
    }

    public void setCardHolderName(String cardHolderName) {
        this.cardHolderName = cardHolderName;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    public void setPrimary(boolean primary) {
        isPrimary = primary;
    }

    public String getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getEncryptedCardNumber() {
        return encryptedCardNumber;
    }

    public String getCardHolderName() {
        return cardHolderName;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public String getCardType() {
        return cardType;
    }

    public boolean isPrimary() {
        return isPrimary;
    }
}
