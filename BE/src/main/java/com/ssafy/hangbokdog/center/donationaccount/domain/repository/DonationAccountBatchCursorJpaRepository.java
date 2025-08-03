package com.ssafy.hangbokdog.center.donationaccount.domain.repository;

import com.ssafy.hangbokdog.center.donationaccount.domain.DonationAccountBatchCursor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DonationAccountBatchCursorJpaRepository extends JpaRepository<DonationAccountBatchCursor, Long>, DonationAccountBatchCursorJpaRepositoryCustom {

	@Query("""
	SELECT dk.lastUpdatedKey
	FROM DonationAccountBatchCursor dk
	WHERE dk.centerId = :centerId
	""")
	Long getLastUpdatedKey(Long centerId);

}
