package com.example.project_spring_boot_backend.resource;

import com.example.project_spring_boot_backend.domain.User;
import com.example.project_spring_boot_backend.security.JwtTokenUtil;
import com.example.project_spring_boot_backend.service.UserService;
import jakarta.validation.Valid;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public UserController(UserService userService, JwtTokenUtil jwtTokenUtil) {
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody @Valid @NotNull User user) {
        if (user.getUserName() == null || user.getUserName().isEmpty() || user.getPassword() == null || user.getPassword().isEmpty()) {
            System.out.println(user);
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        User registeredUser = userService.registerUser(user.getUserName(), user.getPassword());
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

//password reset karnay ka function
    @PutMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long id, @RequestBody @NotNull Map<String, String> passwordMap) {
        String newPassword = passwordMap.get("password");
        boolean updateResult = userService.resetUserPassword(id, newPassword);
        if (updateResult) {
            return ResponseEntity.ok().body("Password updated successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to update password");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody @Valid @NotNull User user) {
        if (user.getUserName() == null || user.getUserName().isEmpty() || user.getPassword() == null || user.getPassword().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        User loggedInUser = userService.loginUser(user.getUserName(), user.getPassword());
        if (loggedInUser != null) {
            String token = jwtTokenUtil.generateToken(loggedInUser.getUserName());
            Map<String, Object> response = new HashMap<>();
            response.put("userId", loggedInUser.getUserId());
            response.put("userName", loggedInUser.getUserName());
            response.put("contacts", loggedInUser.getContacts());
            response.put("token", token); // Include the token in the response
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed: Unauthorized");
        }
    }

    @GetMapping("/{userName}")
    public ResponseEntity<User> getUserByname(@PathVariable("userName") String userName) {
        User user = userService.getUserByname(userName);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            // You can customize the response based on whether the user was found or not
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
//    @GetMapping("/{userName}")
//    public ResponseEntity<User> getUserById(@PathVariable("userName") String userName) {
//        User user = userService.(id);
//        if (user != null) {
//            return new ResponseEntity<>(user, HttpStatus.OK);
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }


}