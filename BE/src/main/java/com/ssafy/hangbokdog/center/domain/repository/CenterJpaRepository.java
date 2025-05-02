package com.ssafy.hangbokdog.center.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ssafy.hangbokdog.center.domain.Center;

public interface CenterJpaRepository extends JpaRepository<Center, Long> {

	@Query("""
			select c.name
			from Center c
			where c.id = :id
			""")
	String findNameById(Long id);
}
