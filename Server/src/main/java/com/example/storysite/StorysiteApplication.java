package com.example.storysite;

import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.storysite.entity.User;
import com.example.storysite.entity.UserRole;
import com.example.storysite.repository.UserRepository;

@SpringBootApplication
@EnableJpaRepositories("com.example.storysite.repository")
public class StorysiteApplication {

	@Value("${app.security.bootstrap-admin.username:admin}")
	private String bootstrapUsername;

	@Value("${app.security.bootstrap-admin.password:changeMe!123}")
	private String bootstrapPassword;

	public static void main(String[] args) {
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
		SpringApplication.run(StorysiteApplication.class, args);
	}

	@Bean
	CommandLineRunner seedAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.existsByUsername(bootstrapUsername)) {
				User admin = new User();
				admin.setUsername(bootstrapUsername);
				admin.setPassword(passwordEncoder.encode(bootstrapPassword));
				admin.setRole(UserRole.ADMIN);
				userRepository.save(admin);
			}
		};
	}
}
