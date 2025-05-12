package com.ssafy.hangbokdog.dog.dog.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.dog.dog.domain.Dog;

public interface DogJpaRepository extends JpaRepository<Dog, Long>, DogJpaRepositoryCustom {

	@Query("""
			SELECT COUNT(d.id)
   			FROM Dog d
   			WHERE d.centerId = :centerId AND d.status != 'ADOPTED' AND d.isStar = false
		""")
	int countByCenterId(@Param("centerId") Long centerId);

	int countByLocationId(Long locationId);

	@Transactional
	@Modifying
	@Query("""
			UPDATE Dog d
			SET d.locationId = :newLocationId
			WHERE d.locationId = :locationId
		""")
	void bulkUpdateDogLocationId(@Param("locationId") Long locationId, @Param("newLocationId") Long newLocationId);

	@Transactional
	@Modifying
	@Query("""
			DELETE Dog d
			WHERE d.locationId = :locationId
		""")
	void deleteAllByLocationId(Long locationId);
}
