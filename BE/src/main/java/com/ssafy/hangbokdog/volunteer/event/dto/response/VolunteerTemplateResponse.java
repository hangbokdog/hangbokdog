package com.ssafy.hangbokdog.volunteer.event.dto.response;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerTemplate;

public record VolunteerTemplateResponse(
        String info,
        String precaution
) {
    public static VolunteerTemplateResponse from(VolunteerTemplate volunteerTemplate) {
        return new VolunteerTemplateResponse(
                volunteerTemplate.getInfo(),
                volunteerTemplate.getPrecaution()
        );
    }
}
