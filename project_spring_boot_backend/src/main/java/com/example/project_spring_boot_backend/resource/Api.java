package com.example.project_spring_boot_backend.resource;

import com.example.project_spring_boot_backend.domain.Contact;
import com.example.project_spring_boot_backend.service.Services;
import com.example.project_spring_boot_backend.domain.User;
import com.example.project_spring_boot_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import java.util.List; // Corrected import
import java.security.Principal; // Added import
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import static com.example.project_spring_boot_backend.constant.Constant.PHOTO_DIRECTORY;
import static org.springframework.http.MediaType.IMAGE_JPEG_VALUE;
import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class Api {
    private final Services contactService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Contact> createContact(@RequestBody Contact contact, @RequestParam("userId") Long userId) {
        User user = userService.getUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        contact.setUser(user);
        Contact savedContact = contactService.save(contact);
        return ResponseEntity.ok(savedContact);
    }
    //updating contact for user
    @PutMapping("/users/{userId}/contacts/{id}")
    public ResponseEntity<Contact> updateContactForUser(@PathVariable Long userId, @PathVariable String id, @RequestBody Contact updatedContact) {
        Contact contact = contactService.updateContactForUser(id, userId, updatedContact);
        return ResponseEntity.ok(contact);
    }


    @GetMapping
    public ResponseEntity<Page<Contact>> getContacts(@RequestParam(value = "page", defaultValue = "0") int page,
                                                     @RequestParam(value = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok().body(contactService.getAllContacts(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContact(@PathVariable(value = "id") String id) {
        return ResponseEntity.ok().body(contactService.getContact(id));
    }

    @PutMapping("/{id}/photo")
    public ResponseEntity<String> uploadPhoto(@PathVariable("userId") Long userId, @PathVariable("id") String contactId, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok().body(contactService.uploadPhotoForUser(contactId, userId, file));
    }

    @GetMapping(path = "/{id}/image", produces = {IMAGE_PNG_VALUE, IMAGE_JPEG_VALUE})
    public byte[] getPhoto(@PathVariable("userId") Long userId, @PathVariable("id") String contactId) throws IOException {
        return contactService.getPhotoForUser(contactId, userId);
    }

    @DeleteMapping("/users/{userId}/contacts/{id}")
    public ResponseEntity<Void> deleteContactForUser(@PathVariable Long userId, @PathVariable String id) {
        contactService.deleteContactForUser(id, userId);
        return ResponseEntity.noContent().build();
    }

    //saaray contacts user kay liye
    @GetMapping("/users/{userId}/contacts")
    public ResponseEntity<Page<Contact>> getAllContactsForUser(@PathVariable Long userId,
                                                               @RequestParam(value = "page", defaultValue = "0") int page,
                                                               @RequestParam(value = "size", defaultValue = "10") int size) {
        Page<Contact> contacts = contactService.getContactsByUserId(userId, page, size);
        return ResponseEntity.ok(contacts);
    }

    //individual contact for user
    @GetMapping("/users/{userId}/contacts/{id}")
    public ResponseEntity<Contact> getContactForUser(@PathVariable Long userId, @PathVariable String id) {
        Contact contact = contactService.getContactForUser(id, userId);
        return ResponseEntity.ok(contact);
    }


}
