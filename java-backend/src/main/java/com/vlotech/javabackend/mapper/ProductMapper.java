package com.vlotech.javabackend.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.vlotech.javabackend.model.Product;

import java.math.BigDecimal;

public class ProductMapper {

    public static Product mapJsonToProduct(JsonNode jsonNode, String category) {
        Product product = new Product();
        product.setName(jsonNode.get("Name").asText());
        product.setLink(jsonNode.get("Link").asText());
        product.setImageUrl(jsonNode.get("Image URL").asText());
        product.setPrice(new BigDecimal(jsonNode.get("Price").asText()));
        product.setBrand(jsonNode.get("Brand").asText());
        product.setProductCode(jsonNode.get("Product Code").asText());
        product.setAvailability(jsonNode.get("Availability").asText());
        product.setCategory(category);
        return product;
    }
}
