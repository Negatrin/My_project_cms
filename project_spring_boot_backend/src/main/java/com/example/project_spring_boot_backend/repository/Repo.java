package com.example.project_spring_boot_backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.project_spring_boot_backend.domain.Contact;

import java.util.List;
import java.util.Optional;

@Repository
public interface Repo extends JpaRepository<Contact, String> {
    Optional<Contact> findById(String id);

    Page<Contact> findByUser_UserId(Long userId, Pageable pageable);

    Optional<Contact> findByIdAndUserUserId(String id, Long userId); // Renamed method
}
