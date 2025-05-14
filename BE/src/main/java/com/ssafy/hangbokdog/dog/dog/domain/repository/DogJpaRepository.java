package com.ssafy.hangbokdog.dog.dog.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.hangbokdog.dog.dog.domain.Dog;

public interface DogJpaRepository extends JpaRepository<Dog, Long>, DogJpaRepositoryCustom {

	@Query("""
			SELECT COUNT(d.id)
   			FROM Dog d
   			WHERE d.centerId = :centerId AND d.status != 'ADOPTED' AND d.isStar = false
		""")
	int countByCenterId(@Param("centerId") Long centerId);

	int countByLocationId(Long locationId);

	@Query("""
			SELECT COUNT(d.id)
			FROM Dog d
			WHERE d.locationId IN :locationIds
		""")
	int countByLocationIdsIn(List<Long> locationIds);
}
