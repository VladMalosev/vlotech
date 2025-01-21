package com.vlotech.javabackend.repository;


import com.vlotech.javabackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // Custom query methods if needed, e.g., finding by email
    User findByEmail(String email);
}