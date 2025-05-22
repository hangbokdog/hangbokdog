package com.ssafy.hangbokdog.post.post.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.hangbokdog.post.post.domain.Post;


public interface PostJpaRepository extends JpaRepository<Post, Long>, PostQueryRepository {

    @Modifying
    @Query("delete from Post p where p.postTypeId = :postTypeId")
    void deleteAllByPostTypeId(@Param("postTypeId") Long postTypeId);
}
