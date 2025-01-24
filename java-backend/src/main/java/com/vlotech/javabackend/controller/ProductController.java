package com.vlotech.javabackend.controller;

import com.vlotech.javabackend.model.Product;
import com.vlotech.javabackend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(value = "search", required = false) String searchTerm,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "40") int pageSize,
            @RequestParam(value = "sort", defaultValue = "name,asc") String sort) {

        // Split the sort parameter safely
        String[] sortParams = sort.split(",");
        String sortField = sortParams.length > 0 ? sortParams[0] : "name";
        String sortDirection = sortParams.length > 1 ? sortParams[1] : "asc";

        Sort sorting;
        try {
            sorting = Sort.by(Sort.Order.by(sortField).with(Sort.Direction.fromString(sortDirection)));
        } catch (IllegalArgumentException e) {
            sorting = Sort.by(Sort.Order.asc(sortField)); // Default to ascending if invalid direction
        }

        // Fetch paginated products
        Page<Product> products = productService.getProducts(searchTerm, page - 1, pageSize, sorting);
        return ResponseEntity.ok(products);
    }


    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }
}
