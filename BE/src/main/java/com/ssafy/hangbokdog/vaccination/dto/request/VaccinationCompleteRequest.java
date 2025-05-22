package com.ssafy.hangbokdog.vaccination.dto.request;

import java.util.List;

public record VaccinationCompleteRequest(
	List<Long> dogIds
) {
}
