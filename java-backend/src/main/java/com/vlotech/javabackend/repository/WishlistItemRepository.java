package com.vlotech.javabackend.repository;

import com.vlotech.javabackend.model.User;
import com.vlotech.javabackend.model.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, String> {
    List<WishlistItem> findByUser(User user);
    Optional<WishlistItem> findByProductId(String productId); // Add this method

    void deleteByUser(User user);
}