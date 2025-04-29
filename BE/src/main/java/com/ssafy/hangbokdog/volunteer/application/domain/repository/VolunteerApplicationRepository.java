package com.ssafy.hangbokdog.volunteer.application.domain.repository;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerApplicationRepository {

    private final VolunteerApplicationJpaRepository volunteerApplicationJpaRepository;
}
