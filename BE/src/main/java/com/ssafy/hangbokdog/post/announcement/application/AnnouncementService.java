package com.ssafy.hangbokdog.post.announcement.application;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.announcement.domain.Announcement;
import com.ssafy.hangbokdog.post.announcement.domain.repository.AnnouncementRepository;
import com.ssafy.hangbokdog.post.announcement.dto.request.AnnouncementCreateRequest;
import com.ssafy.hangbokdog.post.announcement.dto.request.AnnouncementUpdateRequest;
import com.ssafy.hangbokdog.post.announcement.dto.response.AnnouncementCreateResponse;
import com.ssafy.hangbokdog.post.announcement.dto.response.AnnouncementDetailResponse;
import com.ssafy.hangbokdog.post.announcement.dto.response.AnnouncementResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

	private final AnnouncementRepository announcementRepository;
	private final CenterMemberRepository centerMemberRepository;

	public AnnouncementCreateResponse saveAnnouncement(
		Member member,
		Long centerId,
		AnnouncementCreateRequest request,
		List<String> imageUrls
	) {
		CenterMember centerMember = getCenterMember(member.getId(), centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		Announcement announcement = Announcement.builder()
			.centerId(centerId)
			.authorId(member.getId())
			.title(request.title())
			.content(request.content())
			.imageUrls(imageUrls)
			.build();
		return new AnnouncementCreateResponse(announcementRepository.save(announcement).getId());
	}

	public PageInfo<AnnouncementResponse> findAll(Long centerId, String pageToken) {
		return announcementRepository.findAll(centerId, pageToken);
	}

	public AnnouncementDetailResponse getDetail(Long memberId, Long centerId, Long announcementId) {
		CenterMember centerMember = getCenterMember(memberId, centerId);

		return announcementRepository.getDetail(announcementId);
	}

	@Transactional
	public void update(
		Member member,
		Long postId,
		AnnouncementUpdateRequest request,
		List<String> imageUrls
	) {
		Announcement announcement = announcementRepository.findById(postId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.ANNOUNCEMENT_NOT_FOUND));

		if (!announcement.isAuthor(member)) {
			throw new BadRequestException(ErrorCode.NOT_AUTHOR);
		}

		announcement.update(
			request.title(),
			request.content(),
			imageUrls
		);
	}

	public void delete(Member member, Long postId) {
		Announcement announcement = announcementRepository.findById(postId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.ANNOUNCEMENT_NOT_FOUND));

		if (!announcement.isAuthor(member)) {
			throw new BadRequestException(ErrorCode.NOT_AUTHOR);
		}

		announcementRepository.delete(announcement);
	}

	private CenterMember getCenterMember(Long memberId, Long centerId) {
		return centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));
	}
}
