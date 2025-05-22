package com.ssafy.hangbokdog.volunteer.event.dto.response;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerTemplate;

public record VolunteerTemplatePrecautionResponse(
	String precaution
) {
	public static VolunteerTemplatePrecautionResponse from(VolunteerTemplate volunteerTemplate) {
		return new VolunteerTemplatePrecautionResponse(
			volunteerTemplate.getPrecaution()
		);
	}
}
