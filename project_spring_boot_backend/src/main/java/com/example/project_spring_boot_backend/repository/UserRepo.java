package com.example.project_spring_boot_backend.repository;

import com.example.project_spring_boot_backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {
    User findByUserName(String userName);
}
