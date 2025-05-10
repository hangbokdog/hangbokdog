package com.ssafy.hangbokdog.center.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.center.domain.Center;
import com.ssafy.hangbokdog.center.domain.enums.CenterCity;

public interface CenterJpaRepository extends JpaRepository<Center, Long>, CenterJpaRepositoryCustom {

	@Query("""
			SELECT c.name
			FROM Center c
			WHERE c.id = :id
			""")
	String findNameById(Long id);

	@Query("""
			SELECT DISTINCT c.centerCity
			FROM Center c
			""")
	List<CenterCity> getExistingCities();
}
