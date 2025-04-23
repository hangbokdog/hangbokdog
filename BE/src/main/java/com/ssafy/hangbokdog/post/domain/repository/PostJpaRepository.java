package com.ssafy.hangbokdog.post.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.post.domain.Post;

public interface PostJpaRepository extends JpaRepository<Post, Long>, PostQueryRepository {
}
