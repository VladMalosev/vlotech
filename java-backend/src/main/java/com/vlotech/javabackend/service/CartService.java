package com.vlotech.javabackend.service;

import com.vlotech.javabackend.model.CartItem;
import com.vlotech.javabackend.model.Product;
import com.vlotech.javabackend.model.User;
import com.vlotech.javabackend.repository.CartItemRepository;
import com.vlotech.javabackend.repository.ProductRepository;
import com.vlotech.javabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public CartItem addToCart(String userId, String productId, int quantity) {
        // Log the user, product, and quantity for debugging
        System.out.println("userId: " + userId);
        System.out.println("productId: " + productId);
        System.out.println("quantity: " + quantity);

        Optional<User> user = userRepository.findByEmail(userId);
        Optional<Product> product = productRepository.findById(productId);

        if (user.isEmpty() || product.isEmpty()) {
            throw new IllegalArgumentException("User or product not found");
        }

        // Check for existing cart item
        Optional<CartItem> existingCartItem = cartItemRepository.findByUser(user.get())
                .stream()
                .filter(cartItem -> cartItem.getProduct().getId().equals(productId))
                .findFirst();

        CartItem cartItem;
        if (existingCartItem.isPresent()) {
            cartItem = existingCartItem.get();
            // If the item already exists in the cart, just update the quantity correctly
            cartItem.setQuantity(quantity);
        } else {
            cartItem = new CartItem();
            cartItem.setUser(user.get());
            cartItem.setProduct(product.get());
            cartItem.setQuantity(quantity);
        }

        // Save the updated cart item
        return cartItemRepository.save(cartItem);
    }



    public List<CartItem> getCartItemsForUser(User user) {
        return cartItemRepository.findByUser(user);
    }

    public boolean removeFromCart(String cartItemId) {
        Optional<CartItem> cartItem = cartItemRepository.findById(cartItemId);

        if (cartItem.isPresent()) {
            cartItemRepository.delete(cartItem.get());
            return true;
        } else {
            return false;
        }
    }
}