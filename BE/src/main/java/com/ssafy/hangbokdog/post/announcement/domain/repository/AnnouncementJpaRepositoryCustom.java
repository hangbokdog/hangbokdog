package com.ssafy.hangbokdog.post.announcement.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.post.announcement.dto.response.AnnouncementDetailResponse;
import com.ssafy.hangbokdog.post.announcement.dto.response.AnnouncementResponse;

public interface AnnouncementJpaRepositoryCustom {

	List<AnnouncementResponse> getAllAnnouncements(Long centerId, String pageToken, int pageSize);

	AnnouncementDetailResponse getAnnouncement(Long announcementId);

	List<AnnouncementResponse> getLatest(Long centerId);
}
