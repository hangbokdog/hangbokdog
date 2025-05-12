package com.ssafy.hangbokdog.volunteer.event.dto.response;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerTemplate;

public record VolunteerTemplateInfoResponse(
        String info
) {
    public static VolunteerTemplateInfoResponse from(VolunteerTemplate volunteerTemplate) {
        return new VolunteerTemplateInfoResponse(
                volunteerTemplate.getInfo()
        );
    }
}
