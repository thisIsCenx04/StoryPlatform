package com.example.storysite.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.storysite.dto.payment.PaymentCheckoutRequest;
import com.example.storysite.dto.payment.PaymentCheckoutResponse;
import com.example.storysite.service.payment.PaymentService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<PaymentCheckoutResponse> checkout(@Valid @RequestBody PaymentCheckoutRequest request,
            HttpServletRequest servletRequest) {
        String clientIp = servletRequest.getRemoteAddr();
        return ResponseEntity.ok(paymentService.checkout(request, clientIp));
    }

    @GetMapping("/momo/return")
    public void momoReturn(@RequestParam Map<String, String> params, HttpServletResponse response) throws IOException {
        response.sendRedirect(paymentService.handleMomoReturn(params));
    }

    @PostMapping("/momo/notify")
    public ResponseEntity<Map<String, Object>> momoNotify(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(paymentService.handleMomoNotify(payload));
    }

    @GetMapping("/vnpay/return")
    public void vnpayReturn(@RequestParam Map<String, String> params, HttpServletResponse response) throws IOException {
        response.sendRedirect(paymentService.handleVnpayReturn(params));
    }

    @PostMapping("/vnpay/notify")
    public ResponseEntity<Map<String, String>> vnpayNotify(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(paymentService.handleVnpayNotify(params));
    }

    @GetMapping("/paypal/return")
    public void paypalReturn(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        response.sendRedirect(paymentService.handlePaypalReturn(token));
    }

    @GetMapping("/paypal/cancel")
    public void paypalCancel(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        response.sendRedirect(paymentService.handlePaypalCancel(token));
    }
}
