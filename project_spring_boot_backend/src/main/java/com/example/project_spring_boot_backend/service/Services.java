package com.example.project_spring_boot_backend.service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import com.example.project_spring_boot_backend.domain.Contact;
import com.example.project_spring_boot_backend.repository.Repo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.transaction.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.function.BiFunction;
import java.util.function.Function;

import static com.example.project_spring_boot_backend.constant.Constant.PHOTO_DIRECTORY;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@Service
@Slf4j
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor
public class Services {
    private final Repo contactRepo;

    public void deleteContactForUser(String id, Long userId) {
        Contact contact = getContactForUser(id, userId);
        contactRepo.delete(contact);
    }

    public Page<Contact> getAllContacts(int page, int size) {
        return contactRepo.findAll(PageRequest.of(page, size, Sort.by("name")));
    }

    public Contact getContact(String id) {
        return contactRepo.findById(id).orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    public Contact save(Contact contact) {
        log.info("Saving contact: {}", contact);
        if (contact.getUser() == null) {
            throw new RuntimeException("User must be associated with the contact");
        }
        return contactRepo.save(contact);
    }

    public void deleteContact(String id) {
        contactRepo.deleteById(id);
    }

    public String uploadPhotoForUser(String contactId, Long userId, MultipartFile file) {
        log.info("Saving picture for contact ID: {} of user ID: {}", contactId, userId);
        Contact contact = getContactForUser(contactId, userId);
        String photoUrl = photoFunction.apply(contactId, file);
        contact.setPhotoUrl(photoUrl);
        contactRepo.save(contact);
        return photoUrl;
    }

    public byte[] getPhotoForUser(String contactId, Long userId) throws IOException, IOException {
        Contact contact = getContactForUser(contactId, userId);
        String photoUrl = contact.getPhotoUrl();
        if (photoUrl == null) {
            throw new RuntimeException("No photo available for this contact");
        }
        Path path = Paths.get(photoUrl);
        return Files.readAllBytes(path);
    }
    // In your Services.java class

    public Page<Contact> getContactsByUserId(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
        return contactRepo.findByUser_UserId(userId, pageable);
    }

    public Contact getContactForUser(String contactId, Long userId) {
        return contactRepo.findByIdAndUserUserId(contactId, userId)
                .orElseThrow(() -> new RuntimeException("Contact not found or does not belong to the user"));
    }

    public Contact updateContactForUser(String contactId, Long userId, Contact updatedContact) {
        Contact contact = contactRepo.findByIdAndUserUserId(contactId, userId)
                .orElseThrow(() -> new RuntimeException("Contact not found or does not belong to the user"));
        // here we need to update the contact with the new values
        contact.setName(updatedContact.getName());
        contact.setEmail(updatedContact.getEmail());
        contact.setTitle(updatedContact.getTitle());
        contact.setPhone(updatedContact.getPhone());
        contact.setAddress(updatedContact.getAddress());
        contact.setStatus(updatedContact.getStatus());
        contact.setPhotoUrl(updatedContact.getPhotoUrl());
        return contactRepo.save(contact);
    }

    private final Function<String, String> fileExtension = filename -> Optional.of(filename)
            .filter(name -> name.contains("."))
            .map(name -> "." + name.substring(filename.lastIndexOf(".") + 1))
            .orElse(".png");

    private final BiFunction<String, MultipartFile, String> photoFunction = (contactId, image) -> {
        String filename = contactId + fileExtension.apply(image.getOriginalFilename());
        try {
            Path fileStorageLocation = Paths.get(PHOTO_DIRECTORY).toAbsolutePath().normalize();
            if (!Files.exists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
            }
            Files.copy(image.getInputStream(), fileStorageLocation.resolve(filename), REPLACE_EXISTING);
            return ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/contacts/users/{userId}/contacts/{id}/image").toUriString();
        } catch (Exception exception) {
            log.error("Unable to save image: ", exception);
            throw new RuntimeException("Unable to save image");
        }
    };
}