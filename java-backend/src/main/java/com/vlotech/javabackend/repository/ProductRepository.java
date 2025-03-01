package com.vlotech.javabackend.repository;

import com.vlotech.javabackend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String>, JpaSpecificationExecutor<Product> {
    // You can add custom queries here if needed
    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);
    Page<Product> findByBrandIgnoreCase(String brand, Pageable pageable);
    boolean existsByProductCode(String productCode);
    Page<Product> findByAvailabilityIgnoreCase(String availability, Pageable pageable);

    // Find products containing a search term (case insensitive)
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Product> findByBrandAndCategoryAndAvailabilityIgnoreCase(String brand, String category, String availability, Pageable pageable);

    @Query("SELECT DISTINCT p.brand FROM Product p")
    List<String> findDistinctBrands();

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL AND p.category <> ''")
    List<String> findDistinctCategories();
}