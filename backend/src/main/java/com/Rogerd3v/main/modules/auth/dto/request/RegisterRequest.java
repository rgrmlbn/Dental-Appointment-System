package com.Rogerd3v.main.modules.auth.dto.request;

import com.Rogerd3v.main.modules.user.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 20, message = "First name must be between 2 and 20 characters")
    private  String firstName;

    @Size(min = 1, max = 20, message = "Middle name must be between 1 and 20 characters")
    private  String middleName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 20, message = "Last name must be between 2 and 20 characters")
    private  String lastName;

    @Size(min = 1, max = 8, message = "Suffix must be between 1 and 8 characters")
    private  String suffix;

    @NotNull(message = "Gender is required")
    private  Gender gender;

    @NotNull(message = "Birthdate is required")
    @Past(message = "Provide a valid birthdate")
    private  LocalDate dateOfBirth;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^9\\d{9}$", message = "Invalid phone number format")
    private  String contactNumber;

    @NotBlank(message = "Street is required")
    private  String street;

    @NotBlank(message = "Barangay is required")
    private  String barangay;

    @NotBlank(message = "City is required")
    private  String city;

    @NotBlank(message = "Province is required")
    private  String province;

    @NotBlank(message = "Postal code is required")
    @Pattern(regexp = "^\\d{4}$", message = "Invalid postal code")
    private  String postalCode;

    @NotBlank(message = "Email is required")
    @Email(message = "Provide a valid email")
    private  String email;

    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
            message = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    )
    private  String password;

}
