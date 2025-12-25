package com.example.storysite.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.storysite.dto.upload.UploadResponse;
import com.example.storysite.exception.BadRequestException;

@Service
public class UploadService {

    private final Cloudinary cloudinary;
    private final String folder;

    public UploadService(Cloudinary cloudinary, @Value("${cloudinary.folder:story}") String folder) {
        this.cloudinary = cloudinary;
        this.folder = folder;
    }

    public UploadResponse uploadCover(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File upload không hợp lệ");
        }
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "image"));
            String url = result.get("secure_url") != null
                    ? String.valueOf(result.get("secure_url"))
                    : String.valueOf(result.get("url"));
            return new UploadResponse(url);
        } catch (IOException ex) {
            throw new BadRequestException("Không thể upload ảnh");
        }
    }
}
