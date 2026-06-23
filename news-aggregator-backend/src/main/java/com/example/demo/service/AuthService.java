package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.User;
import com.example.demo.model.OtpVerification;
import com.example.demo.model.RegisterRequest;
import com.example.demo.model.ResetPasswordRequest;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.OtpRepository;
import com.example.demo.security.JwtUtil;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ SEND REGISTRATION OTP
    public void sendOtp(String email) {
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new RuntimeException("Invalid email format");
        }

        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new RuntimeException("User already exists");
        }

        String otp = generateOtp();
        saveOrUpdateOtp(email, otp);
        emailService.sendOtpEmail(email, otp, "NewsHub - Email Verification Code");
    }

    // ✅ SEND FORGOT PASSWORD OTP
    public void sendForgotPasswordOtp(String email) {
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new RuntimeException("Invalid email format");
        }

        userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not registered"));

        String otp = generateOtp();
        saveOrUpdateOtp(email, otp);
        emailService.sendOtpEmail(email, otp, "NewsHub - Password Reset Code");
    }

    // ✅ REGISTER WITH OTP
    public String register(RegisterRequest request) {
        if (request.getEmail() == null || !request.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new RuntimeException("Invalid email format");
        }

        OtpVerification verification = otpRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Verification code not requested"));

        if (!verification.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid verification code");
        }

        if (verification.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpRepository.delete(verification);
            throw new RuntimeException("Verification code has expired");
        }

        Optional<User> existing = userRepository.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            throw new RuntimeException("User already exists");
        }

        Optional<User> existingUsername = userRepository.findByUsername(request.getUsername());
        if (existingUsername.isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // Keeps plain text as per base implementation
        userRepository.save(user);

        otpRepository.delete(verification);
        return "User registered successfully";
    }

    // ✅ RESET PASSWORD WITH OTP
    public String resetPassword(ResetPasswordRequest request) {
        OtpVerification verification = otpRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Verification code not requested"));

        if (!verification.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid verification code");
        }

        if (verification.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpRepository.delete(verification);
            throw new RuntimeException("Verification code has expired");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(request.getNewPassword());
        userRepository.save(user);

        otpRepository.delete(verification);
        return "Password reset successfully";
    }

    // ✅ LOGIN
    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(email);
    }

    // --- Helper Methods ---
    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    private void saveOrUpdateOtp(String email, String otp) {
        Optional<OtpVerification> existing = otpRepository.findByEmail(email);
        OtpVerification verification = existing.orElse(new OtpVerification());
        verification.setEmail(email);
        verification.setOtp(otp);
        verification.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(verification);
    }
}
