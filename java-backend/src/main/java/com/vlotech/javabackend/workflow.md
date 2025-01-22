# Workflow

1. A request is sent from a client(frontend)
2. This request hits __UserController__.

UserController is mapped to the /api/auth/register endpoint via @PostMapping annotation. Basically, request is handled by the registerUser() in UserController

3. Next UserController passes the User object to the __UserService__ via 

```User savedUser = userService.registerUser(user);```
In User Service the password will be hashed and the User will be saved to the database

```public User registerUser(User user) {
    String encodedPassword = passwordEncoder.encode(user.getPassword());  // Hash the password
    user.setPassword(encodedPassword);  // Set the hashed password back into the user object
    return userRepository.save(user);  // Save the user to the database
}
```

4. Once the User object is saved in the database, the __UserService__ returns the saved User object back to the __UserController__. The controller then sends a ResponseEntity with the saved user as the response body.
5. The client receives the response