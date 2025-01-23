package com.vlotech.javabackend.service;

import com.vlotech.javabackend.model.Product;
import com.vlotech.javabackend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;


    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    public boolean isProductExists(String productCode) {
        return productRepository.existsByProductCode(productCode);
    }


    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    @Transactional
    public void addProductFromJson(Product product) {
        // Check if a product with the same product_code already exists
        if (productRepository.existsByProductCode(product.getProductCode())) {
            System.out.println("Product with product_code " + product.getProductCode() + " already exists.");
            return;
        }

        // Insert the new product if it doesn't exist
        productRepository.save(product);
    }

    public Page<Product> getProducts(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (searchTerm != null && !searchTerm.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(searchTerm, pageable);
        }

        return productRepository.findAll(pageable);
    }
}
