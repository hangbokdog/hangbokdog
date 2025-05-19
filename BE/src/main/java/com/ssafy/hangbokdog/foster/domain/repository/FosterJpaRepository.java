package com.ssafy.hangbokdog.foster.domain.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.foster.domain.Foster;

public interface FosterJpaRepository extends JpaRepository<Foster, Long>, FosterJpaRepositoryCustom {
	boolean existsByMemberIdAndDogId(Long memberId, Long dogId);

	@Query("""
		SELECT COUNT(f.id) > 0
		FROM Foster f
		WHERE f.memberId = :memberId AND f.status = 'APPLYING' AND f.dogId = :dogId
		""")
	boolean isFosterApply(Long memberId, Long dogId);

	@Query("""
		SELECT COUNT(f.id) > 0
		FROM Foster f
		JOIN Dog d ON f.dogId = d.id
		WHERE d.id = :centerId AND f.status != 'REJECTED'
		""")
	int getFosterCount(Long centerId);

	@Query("""
		SELECT COUNT(f.id)
		FROM Foster f
		JOIN Dog d ON f.dogId = d.id
		WHERE d.centerId = :centerId AND f.status != 'REJECTED' AND f.createdAt <= :lastMonthEnd
		""")
	int getLastMonthFosterCount(Long centerId, LocalDateTime lastMonthEnd);

}
