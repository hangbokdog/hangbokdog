package com.ssafy.hangbokdog.mileage.domain.repository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.mileage.domain.Mileage;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MileageRepository {

    private final MileageJpaRepository mileageJpaRepository;


    public Optional<Mileage> findByMemberId(Long memberId) {
        return mileageJpaRepository.findByMemberId(memberId);
    }
}
