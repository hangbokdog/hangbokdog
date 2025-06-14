package com.ssafy.hangbokdog.adoption.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.hangbokdog.adoption.domain.Adoption;

public interface AdoptionJpaRepository extends JpaRepository<Adoption, Long>, AdoptionJpaRepositoryCustom {
	@Query("""
		SELECT COUNT(DISTINCT a.dogId)
		FROM Adoption a
		LEFT JOIN Dog d ON d.id = a.dogId
		WHERE a.status = 'APPLIED' AND d.centerId = :centerId
		""")
	Integer countAdoptionWaitingDogs(Long centerId);

	@Query("""
		SELECT COUNT(DISTINCT a.dogId)
		FROM Adoption a
		LEFT JOIN Dog d ON d.id = a.dogId
		WHERE a.status = 'ACCEPTED' AND d.centerId = :centerId
		""")
	Integer countAdoptedDogs(Long centerId);

	@Modifying
	@Query("DELETE FROM Adoption a WHERE a.dogId = :dogId AND a.status != 'ACCEPTED'")
	void deleteByDogId(@Param("dogId") Long dogId);
}
