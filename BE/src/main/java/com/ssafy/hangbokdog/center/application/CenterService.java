package com.ssafy.hangbokdog.center.application;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.domain.Center;
import com.ssafy.hangbokdog.center.domain.CenterJoinRequest;
import com.ssafy.hangbokdog.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.domain.DonationAccount;
import com.ssafy.hangbokdog.center.domain.repository.CenterJoinRequestRepository;
import com.ssafy.hangbokdog.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.center.domain.repository.DonationAccountRepository;
import com.ssafy.hangbokdog.center.dto.CenterJoinSearchInfo;
import com.ssafy.hangbokdog.center.dto.CenterSearchInfo;
import com.ssafy.hangbokdog.center.dto.request.CenterCreateRequest;
import com.ssafy.hangbokdog.center.dto.response.AppliedCenterResponse;
import com.ssafy.hangbokdog.center.dto.response.CenterJoinRequestResponse;
import com.ssafy.hangbokdog.center.dto.response.CenterSearchResponse;
import com.ssafy.hangbokdog.center.dto.response.ExistingCenterCityResponse;
import com.ssafy.hangbokdog.center.dto.response.MyCenterResponse;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CenterService {

	private final CenterRepository centerRepository;
	private final CenterMemberRepository centerMemberRepository;
	private final CenterJoinRequestRepository centerJoinRequestRepository;
	private final DonationAccountRepository donationAccountRepository;

	@Transactional
	public Long createCenter(Member member, CenterCreateRequest request) {

		Center center = Center.builder()
			.name(request.name())
			.centerCity(request.centerCity())
			.sponsorAmount(request.sponsorAmount())
			.build();

		Long centerId = centerRepository.create(center).getId();

		CenterMember centerMember = CenterMember.builder()
				.centerId(centerId)
				.memberId(member.getId())
				.build();

		centerMember.promote();
		centerMemberRepository.save(centerMember);

		donationAccountRepository.createDonationAccount(DonationAccount.createDonationAccount(
			centerId,
			0L
		));

		return centerId;
	}

	public void join(Member member, Long centerId) {
		if (!centerRepository.existsById(centerId)) {
			throw new BadRequestException(ErrorCode.CENTER_NOT_FOUND);
		}

		if (centerMemberRepository.existsByMemberIdAndCenterId(member.getId(), centerId)) {
			throw new BadRequestException(ErrorCode.ALREADY_JOIN_CENTER);
		}

		if (centerJoinRequestRepository.existsByMemberIdAndCenterId(member.getId(), centerId)) {
			throw new BadRequestException(ErrorCode.ALREADY_CENTER_JOIN_REQUEST);
		}

		centerJoinRequestRepository.save(
				CenterJoinRequest.builder()
						.centerId(centerId)
						.memberId(member.getId())
						.build()
		);
	}

	@Transactional
	public void approve(Member member, Long centerJoinRequestId) {
		var centerJoinRequest = centerJoinRequestRepository.findById(centerJoinRequestId)
				.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_JOIN_REQUEST_NOT_FOUND));

		Long centerId = centerJoinRequest.getCenterId();
		var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
				.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		centerMemberRepository.save(
				CenterMember.builder()
						.centerId(centerId)
						.memberId(centerJoinRequest.getMemberId())
						.build()
		);

		centerJoinRequestRepository.deleteById(centerJoinRequest.getId());
	}

	public PageInfo<CenterJoinRequestResponse> findAll(Member member, Long centerId, String pageToken) {
		var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
				.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		return centerJoinRequestRepository.findAll(centerId, pageToken);
	}

	public List<MyCenterResponse> getMyCenters(Long memberId) {
		return centerMemberRepository.getMyCenters(memberId);
	}

	public List<CenterSearchResponse> searchCentersByName(Long memberId, String name) {
		List<CenterSearchInfo> searchInfos = centerMemberRepository.getCentersByName(name);
		List<CenterJoinSearchInfo> joinSearchInfos = centerJoinRequestRepository.findCenterIdsByMemberId(memberId);
		List<CenterMember> centerMemberInfos = centerMemberRepository.getCenterMembersByMemberId(memberId);

		List<CenterSearchResponse> result = new ArrayList<>();
		for (CenterSearchInfo center : searchInfos) {
			String status = "가입신청";

			for (CenterJoinSearchInfo joinInfo : joinSearchInfos) {
				if (joinInfo.centerId().equals(center.id())) {
					status = "신청중";
					break;
				}
			}

			for (CenterMember memberInfo : centerMemberInfos) {
				if (memberInfo.getCenterId().equals(center.id())) {
					status = memberInfo.getGrade().toString();
					break;
				}
			}

			result.add(new CenterSearchResponse(center.id(), center.name(), status));
		}

		return result;
	}

	public ExistingCenterCityResponse getExistingCity() {
		return new ExistingCenterCityResponse(centerRepository.getExistingCities());
	}

	public List<AppliedCenterResponse> getAppliedCenters(Long memberId) {
		return centerJoinRequestRepository.getAppliedCentersByMemberId(memberId);
	}

	public void deleteCenterJoinRequest(Long memberId, Long centerJoinRequestId) {
		CenterJoinRequest centerJoinRequest = centerJoinRequestRepository.findById(centerJoinRequestId)
				.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_JOIN_REQUEST_NOT_FOUND));

		if (!centerJoinRequest.isAuthor(memberId)) {
			throw new BadRequestException(ErrorCode.NOT_AUTHOR);
		}

		centerJoinRequestRepository.deleteById(centerJoinRequest.getId());
	}
}
