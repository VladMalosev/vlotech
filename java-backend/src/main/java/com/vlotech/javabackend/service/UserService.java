package com.vlotech.javabackend.service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import com.vlotech.javabackend.model.User;
import com.vlotech.javabackend.repository.UserRepository;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static javax.crypto.Cipher.SECRET_KEY;

@Service
public class UserService {
    private final UserRepository userRepository;
    public final PasswordEncoder passwordEncoder;

    @Value("${JWT_SECRET_KEY}")  // have to think about the placement, placeholder atm
    private String secretKey;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        //save user
        return userRepository.save(user);
    }

    public String loginUser(String email, String password) throws Exception {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            throw new Exception("User not found with email: " + email);
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid password for email: " + email);
        }

        return generateToken(user);
    }


    private String generateToken(User user) {
        if (secretKey == null || secretKey.isEmpty()) {
            throw new IllegalStateException("JWT secret key is not configured");
        }

        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

        return Jwts.builder()
                .setClaims(Map.of(
                        "email", user.getEmail(),
                        "firstName", user.getFirstName(),
                        "lastName", user.getLastName()
                ))
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public void validateToken(String token) {
        try {
            if (secretKey == null || secretKey.isEmpty()) {
                throw new IllegalStateException("JWT secret key is not configured");
            }

            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
            Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
        } catch (Exception e) {
            System.err.println("Token validation failed: " + e.getMessage());
            throw new IllegalArgumentException("Invalid token");
        }
    }


    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public String getUserEmailFromToken(String token) {
        if (secretKey == null || secretKey.isEmpty()) {
            throw new IllegalStateException("JWT secret key is not configured");
        }

        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

        String email = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseSignedClaims(token)
                .getBody()
                .get("email", String.class);

        return email;
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public boolean isEmailAvailable(String email) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        return existingUser.isEmpty();
    }

}
