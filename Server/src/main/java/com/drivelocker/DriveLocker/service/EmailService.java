package com.drivelocker.DriveLocker.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    /**
     * Sends a welcome email using an HTML template.
     *
     * @param toEmail The recipient's email address.
     * @param name    The recipient's name for personalization.
     */
    public void sendWelcomeEmail(String toEmail, String name) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setFrom(fromEmail);
            helper.setSubject("Welcome to DriveLocker!");

            // Prepare the Thymeleaf context
            Context context = new Context();
            context.setVariable("name", name); // Pass the name to the template

            // Process the template
            String htmlContent = templateEngine.process("welcome", context);
            helper.setText(htmlContent, true); // true indicates this is an HTML email

            mailSender.send(message);
        } catch (MessagingException e) {
            // It's a good practice to log the error
            System.err.println("Failed to send welcome email: " + e.getMessage());
            // Optionally rethrow as a custom runtime exception
        }
    }

    public void sendOtpEmail(String toEmail, String otp) {
        sendHtmlEmail(toEmail, "Email Verification", "VerifyEmail", otp);
    }

    public void sendResetOtpEmail(String toEmail, String otp) {
        sendHtmlEmail(toEmail, "Password Reset OTP", "Password-reset", otp);
    }

    private void sendHtmlEmail(String toEmail, String subject, String templateName, String otp) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setFrom(fromEmail);
            helper.setSubject(subject);

            // Prepare the email context
            Context context = new Context();
            context.setVariable("email", toEmail);
            context.setVariable("otp", otp);

            // Process the template
            String htmlContent = templateEngine.process(templateName, context);
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Failed to send HTML email: " + e.getMessage());
            // Optionally log or rethrow a custom exception
        }
    }
}