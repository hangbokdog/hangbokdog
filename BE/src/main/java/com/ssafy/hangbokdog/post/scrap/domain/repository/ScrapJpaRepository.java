package com.ssafy.hangbokdog.post.scrap.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.post.scrap.domain.Scrap;

public interface ScrapJpaRepository extends JpaRepository<Scrap, Long> {

    boolean existsByPostIdAndMemberId(Long postId, Long memberId);

    void deleteByPostIdAndMemberId(Long postId, Long memberId);
}
