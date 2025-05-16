package com.ssafy.hangbokdog.center.center.application;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.center.domain.Center;
import com.ssafy.hangbokdog.center.center.domain.CenterJoinRequest;
import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterCity;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterStatus;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterJoinRequestRepository;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.center.center.dto.CenterSearchInfo;
import com.ssafy.hangbokdog.center.center.dto.request.CenterCreateRequest;
import com.ssafy.hangbokdog.center.center.dto.response.AppliedCenterResponse;
import com.ssafy.hangbokdog.center.center.dto.response.CenterJoinRequestResponse;
import com.ssafy.hangbokdog.center.center.dto.response.CenterJoinResponse;
import com.ssafy.hangbokdog.center.center.dto.response.CenterSearchResponse;
import com.ssafy.hangbokdog.center.center.dto.response.ExistingCityResponse;
import com.ssafy.hangbokdog.center.center.dto.response.MyCenterResponse;
import com.ssafy.hangbokdog.center.donationaccount.domain.DonationAccount;
import com.ssafy.hangbokdog.center.donationaccount.domain.repository.DonationAccountRepository;
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

	public CenterJoinResponse join(Member member, Long centerId) {
		if (!centerRepository.existsById(centerId)) {
			throw new BadRequestException(ErrorCode.CENTER_NOT_FOUND);
		}

		if (centerMemberRepository.existsByMemberIdAndCenterId(member.getId(), centerId)) {
			throw new BadRequestException(ErrorCode.ALREADY_JOIN_CENTER);
		}

		if (centerJoinRequestRepository.existsByMemberIdAndCenterId(member.getId(), centerId)) {
			throw new BadRequestException(ErrorCode.ALREADY_CENTER_JOIN_REQUEST);
		}

		Long id = centerJoinRequestRepository.save(
				CenterJoinRequest.builder()
						.centerId(centerId)
						.memberId(member.getId())
						.build()
		).getId();

		return new CenterJoinResponse(id);
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

	public void reject(Member member, Long centerJoinRequestId) {
		var centerJoinRequest = centerJoinRequestRepository.findById(centerJoinRequestId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_JOIN_REQUEST_NOT_FOUND));

		Long centerId = centerJoinRequest.getCenterId();
		var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

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

	public List<CenterSearchResponse> searchCenters(Long memberId, String name, CenterCity centerCity) {
		List<CenterSearchInfo> searchInfos = centerRepository.findCentersByName(name, centerCity);
		List<CenterMember> centerMemberList = centerMemberRepository.getCenterMembersByMemberId(memberId);
		List<CenterJoinRequest> centerJoinRequests = centerJoinRequestRepository
				.getCenterJoinRequestsByMemberId(memberId);
		List<CenterSearchResponse> searchResponses = new ArrayList<>();

		Map<Long, CenterGrade> centerGrade = centerMemberList.stream()
				.collect(Collectors.toMap(
						CenterMember::getCenterId,
						CenterMember::getGrade
				));

		Map<Long, Long> centerJoinRequestIds = centerJoinRequests.stream()
				.collect(Collectors.toMap(
						CenterJoinRequest::getCenterId,
						CenterJoinRequest::getId
				));

		for (CenterSearchInfo searchInfo : searchInfos) {
			CenterStatus status = CenterStatus.NONE;
			Long centerJoinRequestId = null;

			if (centerGrade.containsKey(searchInfo.id())) {
				CenterGrade grade = centerGrade.get(searchInfo.id());

				if (grade.equals(CenterGrade.USER)) {
					status = CenterStatus.MEMBER;
				} else {
					status = CenterStatus.MANAGER;
				}
			}

			if (centerJoinRequestIds.containsKey(searchInfo.id())) {
				centerJoinRequestId = centerJoinRequestIds.get(searchInfo.id());
				status = CenterStatus.APPLIED;
			}

			CenterSearchResponse response = new CenterSearchResponse(
					centerJoinRequestId,
					searchInfo.id(),
					searchInfo.name(),
					searchInfo.centerCity(),
					status
			);

			searchResponses.add(response);
		}
		return searchResponses;
	}

	public List<ExistingCityResponse> getExistingCity() {
		return centerRepository.getExistingCities();
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

	public void deleteCenterMember(Long memberId, Long centerId) {
		CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
				.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.isSelf(memberId) && !centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_CENTER_MEMBER_HIMSELF);
		}

		centerMemberRepository.delete(centerMember);
	}
}
