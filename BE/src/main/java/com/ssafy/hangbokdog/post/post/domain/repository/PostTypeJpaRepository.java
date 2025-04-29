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
}
