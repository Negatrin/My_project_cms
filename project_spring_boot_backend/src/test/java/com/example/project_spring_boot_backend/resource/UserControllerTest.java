package com.example.project_spring_boot_backend.resource;

import com.example.project_spring_boot_backend.domain.User;
import com.example.project_spring_boot_backend.security.JwtTokenUtil;
import com.example.project_spring_boot_backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

public class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testResetPassword_Success() {
        Map<String, String> passwordMap = new HashMap<>();
        passwordMap.put("password", "newPassword123");

        when(userService.resetUserPassword(anyLong(), any(String.class))).thenReturn(true);

        ResponseEntity<?> response = userController.resetPassword(1L, passwordMap);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Password updated successfully", response.getBody());
    }

    @Test
    public void testResetPassword_Failure() {
        Map<String, String> passwordMap = new HashMap<>();
        passwordMap.put("password", "newPassword123");

        when(userService.resetUserPassword(anyLong(), any(String.class))).thenReturn(false);

        ResponseEntity<?> response = userController.resetPassword(1L, passwordMap);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Failed to update password", response.getBody());
    }

    @Test
    public void testRegisterUser_Success() {
        User user = new User();
        user.setUserName("testUser");
        user.setPassword("testPassword");

        User registeredUser = new User();
        registeredUser.setUserName("testUser");
        registeredUser.setPassword("hashedPassword");

        when(userService.registerUser(any(String.class), any(String.class))).thenReturn(registeredUser);

        ResponseEntity<User> response = userController.registerUser(user);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(registeredUser, response.getBody());
    }

    @Test
    public void testRegisterUser_BadRequest() {
        User user = new User();
        user.setUserName("");
        user.setPassword("");

        ResponseEntity<User> response = userController.registerUser(user);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    @SuppressWarnings("unchecked")
    public void testLoginUser_Success() {
        User user = new User();
        user.setUserName("testUser");
        user.setPassword("testPassword");

        User loggedInUser = new User();
        loggedInUser.setUserName("testUser");
        loggedInUser.setPassword("hashedPassword");

        when(userService.loginUser(any(String.class), any(String.class))).thenReturn(loggedInUser);
        when(jwtTokenUtil.generateToken(any(String.class))).thenReturn("testToken");

        ResponseEntity<?> response = userController.loginUser(user);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertEquals("testUser", responseBody.get("userName"));
        assertEquals("testToken", responseBody.get("token"));
    }

    @Test
    public void testLoginUser_Unauthorized() {
        User user = new User();
        user.setUserName("testUser");
        user.setPassword("testPassword");

        when(userService.loginUser(any(String.class), any(String.class))).thenReturn(null);

        ResponseEntity<?> response = userController.loginUser(user);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}