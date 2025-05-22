package com.ssafy.hangbokdog.post.announcement.domain.repository;

import java.util.List;
import java.util.Optional;

import javax.swing.text.html.Option;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.post.announcement.domain.Announcement;
import com.ssafy.hangbokdog.post.announcement.dto.response.AnnouncementDetailResponse;
import com.ssafy.hangbokdog.post.announcement.dto.response.AnnouncementResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AnnouncementRepository {

	private static final int ANNOUNCEMENT_PAGE_SIZE = 20;

	private final AnnouncementJpaRepository announcementJpaRepository;

	public Announcement save(Announcement announcement) {
		return announcementJpaRepository.save(announcement);
	}

	public PageInfo<AnnouncementResponse> findAll(Long centerId, String pageToken) {
		var data = announcementJpaRepository.getAllAnnouncements(centerId, pageToken, ANNOUNCEMENT_PAGE_SIZE);
		return PageInfo.of(data, ANNOUNCEMENT_PAGE_SIZE, AnnouncementResponse::id);
	}

	public AnnouncementDetailResponse getDetail(Long announcementId) {
		return announcementJpaRepository.getAnnouncement(announcementId);
	}

	public Optional<Announcement> findById(Long announcementId) {
		return announcementJpaRepository.findById(announcementId);
	}

	public void delete(Announcement announcement) {
		announcementJpaRepository.delete(announcement);
	}

	public List<AnnouncementResponse> getLatest(Long centerId) {
		return announcementJpaRepository.getLatest(centerId);
	}
}
