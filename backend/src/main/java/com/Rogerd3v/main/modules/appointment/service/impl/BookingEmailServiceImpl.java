package com.Rogerd3v.main.modules.appointment.service.impl;

import com.Rogerd3v.main.modules.appointment.entity.AppointmentEntity;
import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingEmailServiceImpl {

    private final SpringTemplateEngine templateEngine;

    @Value("${resend.api-key}")
    private String resendApiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    // THIS WILL NOT WORK UNLESS IF YOU HAVE YOUR OWN DOMAIN REGISTERED TO RESENDER
    @Async("emailTaskExecutor")
    public void sendBookingConfirmation(AppointmentEntity appointment) {
        try {
            String patientEmail = appointment.getPatient().getEmail();
            String patientName  = appointment.getPatient().getFirstName();
            String doctorName   = appointment.getDoctor().getUser().getFirstName()
                    + " " + appointment.getDoctor().getUser().getLastName();

            Context context = new Context();
            context.setVariable("patientName", patientName);
            context.setVariable("doctorName",  doctorName);
            context.setVariable("date",        appointment.getDate().toString());
            context.setVariable("startTime",   appointment.getStartTime().toString());
            context.setVariable("endTime",     appointment.getEndTime().toString());
            context.setVariable("services",    appointment.getServices().toString());

            String htmlBody = templateEngine.process("email/booking-confirmation", context);

            Resend resend = new Resend(resendApiKey);

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(patientEmail)
                    .subject("Appointment Confirmed")
                    .html(htmlBody)
                    .build();

            resend.emails().send(params);
            log.info("Booking confirmation sent to {} on thread {}",
                    patientEmail, Thread.currentThread().getName());

        } catch (Exception e) {
            log.error("Failed to send booking confirmation email: {}", e.getMessage(), e);
        }
    }
}