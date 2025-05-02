package com.ssafy.hangbokdog.dog.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.hangbokdog.dog.domain.Dog;

public interface DogJpaRepository extends JpaRepository<Dog, Long>, DogJpaRepositoryCustom {

	@Query("""
			SELECT COUNT(d.id)
   			FROM Dog d
   			WHERE d.centerId = :centerId AND d.status != 'ADOPTED' AND d.isStar = false
		""")
	int countByCenterId(@Param("centerId") Long centerId);
}
