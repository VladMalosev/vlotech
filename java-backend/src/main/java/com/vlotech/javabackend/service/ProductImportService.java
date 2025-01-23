package com.vlotech.javabackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vlotech.javabackend.mapper.ProductMapper;
import com.vlotech.javabackend.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class ProductImportService {

    @Autowired
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    public void importProductsFromFile(String filePath, String category) throws IOException {
        File file = new File(filePath);
        JsonNode rootNode = objectMapper.readTree(file);

        for (JsonNode productNode : rootNode) {
            // Map JSON data to Product object
            Product product = ProductMapper.mapJsonToProduct(productNode, category);

            // Check if product already exists in the database
            if (!productService.isProductExists(product.getProductCode())) {
                // Add product if it doesn't exist
                productService.addProductFromJson(product);
            } else {
                System.out.println("Product with product_code " + product.getProductCode() + " already exists. Skipping...");
            }
        }
    }
}