package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerTemplate;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VolunteerTemplateRepository {
    private final VolunteerTemplateJpaRepository volunteerTemplateJpaRepository;

    public Optional<VolunteerTemplate> findByAddressBookId(Long addressBookId) {
        return volunteerTemplateJpaRepository.findByAddressBookId(addressBookId);
    }

    public VolunteerTemplate save(VolunteerTemplate volunteerTemplate) {
        return volunteerTemplateJpaRepository.save(volunteerTemplate);
    }
}
