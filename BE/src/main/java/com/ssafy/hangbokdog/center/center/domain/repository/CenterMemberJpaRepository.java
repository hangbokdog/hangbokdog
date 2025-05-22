package com.ssafy.hangbokdog.center.center.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;

public interface CenterMemberJpaRepository extends JpaRepository<CenterMember, Long>, CenterMemberJpaRepositoryCustom {
    boolean existsByMemberIdAndCenterId(Long memberId, Long centerId);

    Optional<CenterMember> findByMemberIdAndCenterId(Long memberId, Long centerId);

	List<CenterMember> findByMemberId(Long memberId);

	@Query("""
		SELECT cm
		FROM CenterMember cm
		WHERE cm.memberId = :memberId AND cm.main = true
		""")
	CenterMember getMainCenterByMemberId(Long memberId);

	@Query("""
		SELECT cm.memberId
		FROM CenterMember cm
		WHERE cm.centerId = :centerId AND cm.grade = :grade
		""")
	List<Long> getTargetIdsByCenterIdAndGrade(Long centerId, CenterGrade grade);

	@Query("""
		SELECT cm.memberId
		FROM CenterMember cm
		WHERE cm.centerId = :centerId
		""")
	List<Long> getTargetAllIds(Long centerId);

	@Modifying
	@Query("DELETE FROM CenterMember cm WHERE cm.memberId = :memberId AND cm.centerId = :centerId")
    void deleteByMemberIdAndCenterId(Long memberId, Long centerId);
}
