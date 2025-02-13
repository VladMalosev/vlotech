package com.vlotech.javabackend.service;

import com.vlotech.javabackend.model.PaymentOption;
import com.vlotech.javabackend.repository.PaymentOptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentOptionService {

    private final PaymentOptionRepository paymentOptionRepository;
    private final EncryptionService encryptionService;

    @Autowired
    public PaymentOptionService(PaymentOptionRepository paymentOptionRepository, EncryptionService encryptionService) {
        this.paymentOptionRepository = paymentOptionRepository;
        this.encryptionService = encryptionService;
    }

    public PaymentOption savePaymentOption(PaymentOption paymentOption) {
        //encr
        String encyptedCardNumber = encryptionService.encrypt(paymentOption.getCardNumber());
        paymentOption.setCardNumber(encyptedCardNumber);

        return paymentOptionRepository.save(paymentOption);
    }

    public String getDecryptedCardNumber(String paymentOptionId) {
        PaymentOption paymentOption = paymentOptionRepository.findById(paymentOptionId)
                .orElseThrow(() -> new RuntimeException("Payment Option not found"));

        // Decrypt card number before returning
        return encryptionService.decrypt(paymentOption.getCardNumber());
    }


    public List<PaymentOption> getPaymentOptionsByUserId(String userId) {
        return paymentOptionRepository.findByUserId(userId);
    }

    public void deletePaymentOption(String id) {
        paymentOptionRepository.deleteById(id);
    }
}
