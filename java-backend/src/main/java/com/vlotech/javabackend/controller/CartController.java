package com.vlotech.javabackend.controller;

import com.vlotech.javabackend.model.CartItem;
import com.vlotech.javabackend.model.Product;
import com.vlotech.javabackend.model.User;
import com.vlotech.javabackend.service.CartService;
import com.vlotech.javabackend.service.ProductService;
import com.vlotech.javabackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserService userService;
    private final ProductService productService;

    @Autowired
    public CartController(CartService cartService, UserService userService, ProductService productService) {
        this.cartService = cartService;
        this.userService = userService;
        this.productService = productService;
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@AuthenticationPrincipal UserDetails userDetails,
                                              @RequestParam String productId,
                                              @RequestParam int quantity) {
        if (userDetails == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String userId = userDetails.getUsername();
        Optional<User> optionalUser = userService.findByEmail(userId);
        if (optionalUser.isEmpty()) {
            System.out.println("User not found: " + userId);  // Add logging
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User user = optionalUser.get(); // Get the User from the Optional

        Product product = productService.getProductById(productId);
        if (product == null) {
            System.out.println("Product not found: " + productId);  // Add logging
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        CartItem cartItem = cartService.addToCart(userId, productId, quantity);
        if (cartItem == null) {
            System.out.println("Failed to add item to cart: " + productId);  // Add logging
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok(cartItem);
    }

    @GetMapping("/items")
    public ResponseEntity<List<CartItem>> getCartItem(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        String userId = userDetails.getUsername();
        Optional<User> optionalUser = userService.findByEmail(userId);

        if (optionalUser.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User user = optionalUser.get();
        List<CartItem> cartItems = cartService.getCartItemsForUser(user);
        return ResponseEntity.ok(cartItems);
    }
    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromCart(@RequestParam String cartItemId) {
        boolean isRemoved = cartService.removeFromCart(cartItemId);

        if (isRemoved) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @PostMapping("/update")
    public ResponseEntity<CartItem> updateCartItemQuantity(@AuthenticationPrincipal UserDetails userDetails,
                                                           @RequestParam String cartItemId,
                                                           @RequestParam int quantity) {
        if (userDetails == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String userId = userDetails.getUsername();
        Optional<User> optionalUser = userService.findByEmail(userId);
        if (optionalUser.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        User user = optionalUser.get();

        // Find the CartItem by ID
        Optional<CartItem> optionalCartItem = cartService.getCartItemById(cartItemId);
        if (optionalCartItem.isEmpty() || !optionalCartItem.get().getUser().getId().equals(user.getId())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        CartItem cartItem = optionalCartItem.get();
        cartItem.setQuantity(quantity);  // Update the quantity
        cartService.save(cartItem);  // Save the updated cart item

        return ResponseEntity.ok(cartItem);
    }

}