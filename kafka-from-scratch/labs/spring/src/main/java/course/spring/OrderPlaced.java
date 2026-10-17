package course.spring;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

// A Java record gives the JSON payload an explicit, small contract.
public record OrderPlaced(@NotBlank String eventId, @NotBlank String item, @Min(1) int quantity) {}
