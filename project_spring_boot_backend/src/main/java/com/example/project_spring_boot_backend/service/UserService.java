package com.example.project_spring_boot_backend.service;

import com.example.project_spring_boot_backend.domain.User;
import com.example.project_spring_boot_backend.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

//functions defined here are used in the controller
@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    public UserService(UserRepo userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String userName, String password) {
        User user = new User();
        user.setUserName(userName);
        String hashedPassword = passwordEncoder.encode(password);
        user.setPassword(hashedPassword);
        //log karkay dheko konsi user register ho raha hai
        logger.info("Registering user: {}", userName);
        return userRepository.save(user);
    }

    public User loginUser(String userName, String password) {
        logger.info("Attempting to log in user: {}", userName);
        User user = userRepository.findByUserName(userName);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            logger.info("Login successful for user: {}", userName);
            return user;
        } else {
            logger.warn("Login failed for user: {}", userName);
            return null;
        }
    }

    public User getUserByname(String username) {
        logger.info("Fetching user by username: {}", username);
        return userRepository.findByUserName(username);
    }

    //get all users
    public List<User> getAllUsers() {
        logger.info("Fetching all registered users");
        return userRepository.findAll();
    }
//get indiviual user by id
    public User getUserById(Long id) {
        logger.info("Fetching user by ID: {}", id);
        return userRepository.findById(id).orElse(null);
    }

    //password reset karnay ka
    public boolean resetUserPassword(Long id, String newPassword) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String hashedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(hashedPassword);
            userRepository.save(user);
            return true;
        }
        return false;
    }

}
