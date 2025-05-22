package com.ssafy.hangbokdog.volunteer.event.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.volunteer.event.domain.VolunteerTemplate;

public interface VolunteerTemplateJpaRepository extends JpaRepository<VolunteerTemplate, Long> {
    Optional<VolunteerTemplate> findByAddressBookId(Long addressBookId);
}
