package com.ssafy.hangbokdog.dog.dog.domain.repository;

import java.time.LocalDateTime;
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
			WHERE d.locationId IN :locationIds AND d.isStar = false AND d.status = 'PROTECTED'
		""")
	int countByLocationIdsIn(List<Long> locationIds);

	@Query("""
			SELECT COUNT(d.id)
			FROM Dog d
			WHERE d.centerId = :centerId
					AND d.createdAt <= :lastMonthEnd
					AND d.isStar = false
					AND d.status = 'PROTECTED'
		""")
	int getLastMonthDogCount(Long centerId, LocalDateTime lastMonthEnd);

	@Query("""
			SELECT COUNT(d.id)
			FROM Dog d
			WHERE d.centerId = :centerId AND d.isStar = false AND d.status = 'HOSPITAL'
		""")
	int getHospitalDogCount(Long centerId);

	@Query("""
			SELECT COUNT(d.id)
			FROM Dog d
			WHERE d.centerId = :centerId AND d.isStar = false AND d.status = 'PROTECTED'
		""")
	int getProtectedDogCount(Long centerId);

	@Query("""
			SELECT d.name
			FROM Dog d
			WHERE d.centerId = :centerId
		""")
	List<String> getDogNames(Long centerId);
}
