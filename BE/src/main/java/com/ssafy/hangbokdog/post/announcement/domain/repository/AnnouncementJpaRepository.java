package com.ssafy.hangbokdog.post.announcement.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.hangbokdog.post.announcement.domain.Announcement;

public interface AnnouncementJpaRepository extends JpaRepository<Announcement, Long>, AnnouncementJpaRepositoryCustom {
}
