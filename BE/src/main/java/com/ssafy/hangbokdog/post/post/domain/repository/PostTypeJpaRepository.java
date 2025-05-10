package com.ssafy.hangbokdog.post.post.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.hangbokdog.post.post.domain.PostType;
public interface PostTypeJpaRepository extends JpaRepository<PostType, Long> {

    @Query("""
            select p
            from PostType p
            where (:centerId is null or p.centerId = :centerId)
            """)
    List<PostType> findAllByCenterId(@Param("centerId") Long centerId);

	@Query("""
			select p.name
			from PostType p
			where (p.id = :id)
			""")
	String findNameById(Long id);

	@Query("""
			SELECT COUNT(pt.name) > 0
			FROM PostType pt
			WHERE pt.name = :postTypeName AND pt.centerId = :centerId
			""")
	boolean existsByName(@Param("postTypeName") String postTypeName, @Param("centerId") Long centerId);
}
