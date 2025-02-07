package com.vlotech.javabackend.controller;

import com.vlotech.javabackend.model.User;
import com.vlotech.javabackend.model.WishlistItem;
import com.vlotech.javabackend.service.UserService;
import com.vlotech.javabackend.service.WishlistService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:4200")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;


    @Autowired
    public WishlistController(WishlistService wishlistService, UserService userService) {
        this.wishlistService = wishlistService;
        this.userService = userService;
    }

    @PostMapping("/add")
    public ResponseEntity<WishlistItem> addToWishlist(@AuthenticationPrincipal UserDetails userDetails,
                                                      @RequestParam String productId) {
        if (userDetails == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        String userId = userDetails.getUsername();
        Optional<User> userOpt = userService.findByEmail(userId);
        if (userOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        WishlistItem wishlistItem = wishlistService.addToWishlist(userId, productId);
        return ResponseEntity.ok(wishlistItem);
    }

    @GetMapping("/items")
    public ResponseEntity<List<WishlistItem>> getWishlistItems(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        String userId = userDetails.getUsername();
        Optional<User> userOpt = userService.findByEmail(userId);

        if (userOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        User user = userOpt.get();
        List<WishlistItem> wishlistItems = wishlistService.getWishlistForUser(user);
        return new ResponseEntity<>(wishlistItems, HttpStatus.OK);
    }

    @DeleteMapping("/remove/{wishlistItemId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable String wishlistItemId) {
        System.out.println("Received wishlistItemId: " + wishlistItemId);
        boolean removed = wishlistService.removeFromWishlist(wishlistItemId);
        if (removed) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String userId = userDetails.getUsername();
        Optional<User> userOpt = userService.findByEmail(userId);

        if (userOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        wishlistService.clearWishlist(userOpt.get());
        return ResponseEntity.noContent().build();
    }
}
