package com.ssafy.hangbokdog.volunteer.application.domain.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplication;

import lombok.RequiredArgsConstructor;

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
