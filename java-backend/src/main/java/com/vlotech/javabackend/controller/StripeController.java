package com.vlotech.javabackend.controller;


import com.stripe.Stripe;

import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/stripe")
public class StripeController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostMapping("/create-checkout-session")
    public Map<String, String> createCheckoutSession(@RequestBody Map<String, Object> request) throws Exception {
        Stripe.apiKey = stripeSecretKey;

        // Convert totalAmount to Long
        long totalAmount = ((Integer) request.get("totalAmount")).longValue();

        // Create session with dynamic price
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:4200/payment-success")
                .setCancelUrl("http://localhost:4200/payment-cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(totalAmount)  // Using the amount from frontend
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Cart Total")
                                                                .build())
                                                .build())
                                .build())
                .build();

        Session session = Session.create(params);
        Map<String, String> response = new HashMap<>();
        response.put("sessionId", session.getId());
        return response;
    }
}