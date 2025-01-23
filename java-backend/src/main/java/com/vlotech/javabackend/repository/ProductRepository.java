package com.vlotech.javabackend.repository;

import com.vlotech.javabackend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    // You can add custom queries here if needed
    List<Product> findByCategory(String category);
    List<Product> findByBrand(String brand);
    boolean existsByProductCode(String productCode);

    // Find products containing a search term (case insensitive)
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
}