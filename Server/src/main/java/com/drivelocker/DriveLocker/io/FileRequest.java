package com.drivelocker.DriveLocker.io;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileRequest {

    @NotNull(message = "File must be provided.")
    private MultipartFile file;

    @NotNull(message = "Passkey must be provided.")
    @NotBlank(message = "Passkey cannot be blank.")
    @Size(min = 8, message = "Passkey must be at least 8 characters long.")
    private String passkey;
}