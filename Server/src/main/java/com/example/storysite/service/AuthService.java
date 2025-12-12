package com.example.storysite.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.storysite.dto.auth.LoginRequest;
import com.example.storysite.dto.auth.LoginResponse;
import com.example.storysite.entity.User;
import com.example.storysite.entity.UserRole;
import com.example.storysite.exception.ForbiddenException;
import com.example.storysite.exception.UnauthorizedException;
import com.example.storysite.repository.UserRepository;
import com.example.storysite.security.CustomUserDetailsService;
import com.example.storysite.security.JwtUtil;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository, JwtUtil jwtUtil,
            CustomUserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    public LoginResponse adminLogin(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Sai thông tin đăng nhập"));

        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Chỉ admin được phép đăng nhập");
        }

        if (!user.isActive()) {
            throw new ForbiddenException("Tài khoản đã bị khóa");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        UserDetails details = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtUtil.generateToken(details);

        return new LoginResponse(token, user.getUsername(), user.getRole());
    }
}
