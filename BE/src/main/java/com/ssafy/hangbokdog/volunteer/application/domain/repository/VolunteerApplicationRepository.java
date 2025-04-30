package com.ssafy.hangbokdog.volunteer.application.domain.repository;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplication;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class VolunteerApplicationRepository {

    private final VolunteerApplicationJpaRepository volunteerApplicationJpaRepository;

    public boolean existsByVolunteerIdAndMemberId(Long volunteerId, Long memberId) {
        return volunteerApplicationJpaRepository.existsByVolunteerIdAndMemberId(volunteerId, memberId);
    }

    public List<VolunteerApplication> saveAll(List<VolunteerApplication> applications) {
        return volunteerApplicationJpaRepository.saveAll(applications);
    }
}
