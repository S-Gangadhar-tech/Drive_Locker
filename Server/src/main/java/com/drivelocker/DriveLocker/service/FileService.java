package com.drivelocker.DriveLocker.service;

import com.drivelocker.DriveLocker.exceptions.*;
import com.drivelocker.DriveLocker.models.File;
import com.drivelocker.DriveLocker.models.PassKey;
import com.drivelocker.DriveLocker.models.User;
import com.drivelocker.DriveLocker.repository.FileRepository;
import com.drivelocker.DriveLocker.repository.PasskeyRepository;
import com.drivelocker.DriveLocker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileService implements IFileService {

    private final PasskeyRepository passkeyRepository;
    private final CloudinaryService cloudinaryService;
    private final PasswordEncoder passwordEncoder;
    private final FileRepository fileRepository;
    private final UserRepository userRepository;

    private User getAndVerifyUser(String email) {
        if (email == null) {
            throw new UserNotFoundException("No user found.");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Account does not exist."));

        if (Boolean.FALSE.equals(user.getIsAccountVerified())) {
            throw new InvalidCredentialsException("Please verify your account first to use this service.");
        }
        return user;
    }


    @Override
    public String fileUpload(String email, String passkey, MultipartFile file) {
        User user = getAndVerifyUser(email);

        PassKey userPasskey = passkeyRepository.findByUserEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Passkey not created for " + email));

        boolean isMatched = passwordEncoder.matches(passkey, userPasskey.getPassKey());

        if (!isMatched) {
            throw new InvalidPasskeyException("Invalid passkey provided.");
        }

        try {
            String originalName = file.getOriginalFilename();
            Map<String, Object> fileData = cloudinaryService.uploadFile(file);

            if (fileData != null && fileData.containsKey("secure_url")) {
                File newFile = new File();
                newFile.setPublicId((String) fileData.get("public_id"));
                newFile.setFileName(originalName);
                newFile.setFileUrl((String) fileData.get("secure_url"));
                newFile.setFileType((String) fileData.get("format"));

                String createdAtString = (String) fileData.get("created_at");
                LocalDateTime createdAt = Instant.parse(createdAtString).atZone(ZoneId.systemDefault()).toLocalDateTime();
                newFile.setCreatedAt(createdAt);

                newFile.setUser(user);

                fileRepository.save(newFile);
                return fileData.toString();
            } else {
                throw new FileStorageException("File upload successful, but URL not found from cloud service.");
            }
        } catch (Exception e) {
            throw new FileStorageException("File upload failed: " + e.getMessage(), e);
        }
    }

    // ✅ METHOD UPDATED
    @Override
    public List<File> getUserFiles(String email, String passkey) {
        // 1. Ensures user is valid and verified
        getAndVerifyUser(email);

        // 2. Fetch the stored passkey for the user
        PassKey userPasskey = passkeyRepository.findByUserEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Passkey not created for " + email));

        // 3. Match the provided passkey with the stored one
        boolean isMatched = passwordEncoder.matches(passkey, userPasskey.getPassKey());

        if (!isMatched) {
            throw new InvalidPasskeyException("Invalid passkey provided. Access to files denied.");
        }

        // 4. If passkey is valid, proceed to fetch files
        List<File> filesList = fileRepository.findByUserEmail(email);

        if (filesList.isEmpty()) {
            // Note: Returning an empty list is often better than throwing an exception here,
            // as having no files is a valid state.
            return filesList;
        }
        return filesList;
    }



    @Override
    public Boolean deleteFiles(String email, List<String> publicIds) {
        getAndVerifyUser(email);

        if (publicIds == null || publicIds.isEmpty()) {
            throw new MissingDetailsException("File public IDs must be provided for deletion.");
        }

        try {
            Map<String, Object> result = cloudinaryService.deleteFiles(publicIds);

            @SuppressWarnings("unchecked")
            Map<String, String> deletedFiles = (Map<String, String>) result.get("deleted");

            boolean allDeleted = publicIds.stream()
                    .allMatch(id -> "deleted".equalsIgnoreCase(deletedFiles.get(id)));

            if (allDeleted) {
                fileRepository.deleteByPublicIdsAndUserEmail(publicIds, email);
                return true;
            } else {
                throw new FileStorageException("Some files failed to delete on the cloud service.");
            }
        } catch (Exception e) {
            throw new FileStorageException("File deletion failed: " + e.getMessage(), e);
        }
    }
}