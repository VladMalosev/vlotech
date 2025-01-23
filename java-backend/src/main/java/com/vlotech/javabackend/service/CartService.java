package com.vlotech.javabackend.service;

import com.vlotech.javabackend.model.CartItem;
import com.vlotech.javabackend.model.Product;
import com.vlotech.javabackend.model.User;
import com.vlotech.javabackend.repository.CartItemRepository;
import com.vlotech.javabackend.repository.ProductRepository;
import com.vlotech.javabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;


    public void addItemToCart(String userId, String productId, int quantity) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if the item is already in the cart
        CartItem existingItem = cartItemRepository.findByUserAndProduct(user, product);


        if (existingItem != null) {
            //update quantity
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepository.save(existingItem);
        } else {
            //create new entry
            CartItem cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }
    }
}