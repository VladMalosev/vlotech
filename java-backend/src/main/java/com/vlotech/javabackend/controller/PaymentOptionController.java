package com.vlotech.javabackend.controller;


import com.vlotech.javabackend.model.PaymentOption;
import com.vlotech.javabackend.service.PaymentOptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-method")
public class PaymentOptionController {

    private final PaymentOptionService paymentOptionService;

    @Autowired
    public PaymentOptionController(PaymentOptionService paymentOptionService) {
        this.paymentOptionService = paymentOptionService;
    }

    @PostMapping
    public ResponseEntity<PaymentOption> addPaymentOption(@RequestBody PaymentOption paymentOption) {
        PaymentOption savedPaymentOption = paymentOptionService.savePaymentOption(paymentOption);
        return ResponseEntity.ok(savedPaymentOption);

    }

    @GetMapping("/{id}/decrypt")
    public ResponseEntity<String> getDecryptedCardNumber(@PathVariable String id) {
        String decryptedCardNumber = paymentOptionService.getDecryptedCardNumber(id);
        return ResponseEntity.ok(decryptedCardNumber);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentOption>> getUserPaymentOptions(@PathVariable String userId) {
        List<PaymentOption> paymentOptions = paymentOptionService.getPaymentOptionsByUserId(userId);
        return ResponseEntity.ok(paymentOptions);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentOption(@PathVariable String id) {
        paymentOptionService.deletePaymentOption(id);
        return ResponseEntity.noContent().build();
    }
}