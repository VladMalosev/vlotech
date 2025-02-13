package com.vlotech.javabackend.service;

import org.springframework.beans.factory.annotation.Value;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

public class EncryptionService {
    @Value("${JWT_SECRET_KEY}")
    private String secretKey;

    private SecretKey getKey() {
        return new SecretKeySpec(secretKey.getBytes(), "AES");
    }

    private IvParameterSpec generateRandomIv() {
        byte[] iv = new byte[16];
        new SecureRandom().nextBytes(iv);
        return new IvParameterSpec(iv);
    }

    public String encrypt(String data) {
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            IvParameterSpec iv = generateRandomIv();
            cipher.init(Cipher.ENCRYPT_MODE, getKey(), iv);

            byte[] encryptedData = cipher.doFinal(data.getBytes());

            byte[] combined = new byte[iv.getIV().length + encryptedData.length];
            System.arraycopy(iv.getIV(), 0, combined, 0, iv.getIV().length);
            System.arraycopy(encryptedData, 0, combined, iv.getIV().length, encryptedData.length);

            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new RuntimeException("Error encrypting data", e);
        }
    }
    public String decrypt(String encryptedData) {
        try {
            byte[] decodedData = Base64.getDecoder().decode(encryptedData);

            // Extract IV
            byte[] ivBytes = new byte[16];
            byte[] encryptedBytes = new byte[decodedData.length - 16];
            System.arraycopy(decodedData, 0, ivBytes, 0, 16);
            System.arraycopy(decodedData, 16, encryptedBytes, 0, encryptedBytes.length);

            IvParameterSpec iv = new IvParameterSpec(ivBytes);

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, getKey(), iv);

            byte[] decryptedData = cipher.doFinal(encryptedBytes);
            return new String(decryptedData);
        } catch (Exception e) {
            throw new RuntimeException("Error decrypting data", e);
        }
    }

}
