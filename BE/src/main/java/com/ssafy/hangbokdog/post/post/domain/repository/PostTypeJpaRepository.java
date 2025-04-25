package com.ssafy.hangbokdog.post.post.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.post.post.domain.PostType;

public interface PostTypeJpaRepository extends JpaRepository<PostType, Long> {
}
