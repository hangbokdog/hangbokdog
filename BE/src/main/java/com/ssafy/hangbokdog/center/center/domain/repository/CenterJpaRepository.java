package com.ssafy.hangbokdog.center.center.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.center.center.domain.Center;

public interface CenterJpaRepository extends JpaRepository<Center, Long>, CenterJpaRepositoryCustom {

	@Query("""
			SELECT c.name
			FROM Center c
			WHERE c.id = :id
			""")
	String findNameById(Long id);
}
