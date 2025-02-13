package com.vlotech.javabackend.repository;

import com.vlotech.javabackend.model.PaymentOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentOptionRepository extends JpaRepository<PaymentOption, String> {

    // Find all payment options for a specific user
    List<PaymentOption> findByUserId(String userId);

    // Find the primary payment option for a user (if any)
    PaymentOption findByUserIdAndIsPrimaryTrue(String userId);
}