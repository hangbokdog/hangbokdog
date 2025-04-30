package com.ssafy.hangbokdog.volunteer.application.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.volunteer.application.domain.VolunteerApplication;

public interface VolunteerApplicationJpaRepository extends JpaRepository<VolunteerApplication, Long> {

    boolean existsByVolunteerIdAndMemberId(Long volunteerId, Long memberId);
}
