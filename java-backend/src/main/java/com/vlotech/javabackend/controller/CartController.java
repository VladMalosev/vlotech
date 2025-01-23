package com.vlotech.javabackend.controller;

import com.vlotech.javabackend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CartController {


    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addItemToCart(@RequestParam String userId,
                                           @RequestParam String productId,
                                           @RequestParam int quantity) {
        cartService.addItemToCart(userId, productId, quantity);
        return ResponseEntity.ok("Successfully added item to the cart");
    }
}
