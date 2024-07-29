package com.example.project_spring_boot_backend.util;

import lombok.Getter;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Component
public class SecretKeyGenerator {

    @Getter
    private String encodedKey;

    @PostConstruct
    public void generateAndStoreSecretKey() {
        try {
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            keyGen.init(256); // 256-bit key for HMAC SHA-256
            SecretKey secretKey = keyGen.generateKey();

            encodedKey = Base64.getEncoder().encodeToString(secretKey.getEncoded());
            System.out.println("Generated JWT Secret Key: " + encodedKey);

        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }
}
