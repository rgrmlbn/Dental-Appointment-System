package com.Rogerd3v.main.modules.appointment.service.impl;

import com.Rogerd3v.main.modules.appointment.entity.AppointmentEntity;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingEmailServiceImpl {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async("emailTaskExecutor")
    public void sendBookingConfirmation(AppointmentEntity appointment) {
        try {
            String patientEmail = appointment.getPatient().getEmail();
            String patientName  = appointment.getPatient().getFirstName();
            String doctorName   = appointment.getDoctor().getUser().getFirstName()
                    + " " + appointment.getDoctor().getUser().getLastName();

            // 1. Build the Thymeleaf context — these map to th:text="${variable}" in the template
            Context context = new Context();
            context.setVariable("patientName", patientName);
            context.setVariable("doctorName",  doctorName);
            context.setVariable("date",        appointment.getDate().toString());
            context.setVariable("startTime",   appointment.getStartTime().toString());
            context.setVariable("endTime",     appointment.getEndTime().toString());
            context.setVariable("services",    appointment.getServices().toString());

            // 2. Render the template into an HTML string
            String htmlBody = templateEngine.process("email/booking-confirmation", context);

            // 3. Build the MimeMessage (supports HTML)
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(patientEmail);
            helper.setSubject("Appointment Confirmed");
            helper.setText(htmlBody, true); // true = isHtml

            mailSender.send(mimeMessage);
            log.info("Booking confirmation sent to {} on thread {}",
                    patientEmail, Thread.currentThread().getName());

        } catch (Exception e) {
            log.error("Failed to send booking confirmation email: {}", e.getMessage(), e);
        }
    }
}