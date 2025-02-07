package com.vlotech.javabackend.service;

import com.vlotech.javabackend.model.Product;
import com.vlotech.javabackend.model.User;
import com.vlotech.javabackend.model.WishlistItem;
import com.vlotech.javabackend.repository.ProductRepository;
import com.vlotech.javabackend.repository.UserRepository;
import com.vlotech.javabackend.repository.WishlistItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {


    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Autowired
    public WishlistService(WishlistItemRepository wishlistItemRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.wishlistItemRepository = wishlistItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public WishlistItem addToWishlist(String userId, String productId) {

        //retrieve user and product
        Optional<User> userOpt = userRepository.findByEmail(userId);
        Optional<Product> productOpt = productRepository.findById(productId);

        if (userOpt.isEmpty() && productOpt.isEmpty()) {
            throw new IllegalArgumentException("User or product not found");
        }

        User user = userOpt.get();
        Product product = productOpt.get();

        //check if already in wishlist
        List<WishlistItem> existingItems = wishlistItemRepository.findByUser(user);
        for (WishlistItem item : existingItems) {
            if (item.getProduct().getId().equals(productId)) {
                return item;
            }
        }
        //otherwise create new wishlist item
        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setUser(user);
        wishlistItem.setProduct(product);
        return wishlistItemRepository.save(wishlistItem);
    }
    public List<WishlistItem> getWishlistForUser(User user) {
        return wishlistItemRepository.findByUser(user);
    }

    public boolean removeFromWishlist(String wishlistItemId) {
        Optional<WishlistItem> wishlistItemOpt = wishlistItemRepository.findByProductId(wishlistItemId);
        if (wishlistItemOpt.isPresent()) {
            System.out.println("Item found: " + wishlistItemOpt.get());
            wishlistItemRepository.delete(wishlistItemOpt.get());
            return true;
        }
        System.out.println("Item not found with ID: " + wishlistItemId);
        return false;
    }

    @Transactional
    public void clearWishlist(User user) {
        wishlistItemRepository.deleteByUser(user);
    }
}
