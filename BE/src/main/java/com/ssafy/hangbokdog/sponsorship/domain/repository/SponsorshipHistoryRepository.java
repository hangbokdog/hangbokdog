package com.ssafy.hangbokdog.sponsorship.domain.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.sponsorship.domain.SponsorshipHistory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SponsorshipHistoryRepository {

	private final SponsorshipHistoryJpaRepository sponsorshipHistoryJpaRepository;
	private final SponsorshipHistoryJdbcRepository sponsorshipHistoryJdbcRepository;

	public void bulkInsertSponsorshipHistory(List<SponsorshipHistory> sponsorshipHistories) {
		sponsorshipHistoryJdbcRepository.batchInsert(sponsorshipHistories);
	}

	public void saveSponsorshipHistory(SponsorshipHistory sponsorshipHistory) {
		sponsorshipHistoryJpaRepository.save(sponsorshipHistory);
	}
}
