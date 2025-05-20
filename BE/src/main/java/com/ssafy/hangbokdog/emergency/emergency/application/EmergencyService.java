package com.ssafy.hangbokdog.emergency.emergency.application;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;
import com.ssafy.hangbokdog.emergency.application.domain.repository.EmergencyApplicationRepository;
import com.ssafy.hangbokdog.emergency.emergency.domain.Emergency;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyType;
import com.ssafy.hangbokdog.emergency.emergency.domain.repository.EmergencyRepository;
import com.ssafy.hangbokdog.emergency.emergency.dto.AppliedEmergencies;
import com.ssafy.hangbokdog.emergency.emergency.dto.EmergencyInfo;
import com.ssafy.hangbokdog.emergency.emergency.dto.request.EmergencyDonationRequest;
import com.ssafy.hangbokdog.emergency.emergency.dto.request.EmergencyTransportRequest;
import com.ssafy.hangbokdog.emergency.emergency.dto.request.EmergencyVolunteerRequest;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.EmergencyCreateResponse;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.EmergencyLatestResponse;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.EmergencyResponse;
import com.ssafy.hangbokdog.fcm.dto.event.EmergencyEvent;
import com.ssafy.hangbokdog.member.domain.Member;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmergencyService {

	private final EmergencyRepository emergencyRepository;
	private final CenterMemberRepository centerMemberRepository;
	private final ApplicationEventPublisher eventPublisher;
	private final CenterRepository centerRepository;
	private final EmergencyApplicationRepository emergencyApplicationRepository;

	@Transactional
	public EmergencyCreateResponse createTransPortEmergency(
		EmergencyTransportRequest request,
		Member member,
		Long centerId
	) {
		CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		String centerName = centerRepository.findNameById(centerId);

		Emergency emergency = Emergency.builder()
			.centerId(centerId)
			.title(request.title())
			.authorId(member.getId())
			.content(request.content())
			.dueDate(request.dueDate())
			.targetGrade(request.targetGrade())
			.emergencyType(EmergencyType.TRANSPORT)
			.build();

		eventPublisher.publishEvent(
			new EmergencyEvent(
				emergency.getId(),
				centerId,
				emergency.getTitle(),
				emergency.getContent(),
				centerName,
				emergency.getTargetGrade()
			)
		);

		return new EmergencyCreateResponse(emergencyRepository.save(emergency).getId());
	}

	@Transactional
	public EmergencyCreateResponse createVolunteerEmergency(
		EmergencyVolunteerRequest request,
		Member member,
		Long centerId
	) {
		CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		String centerName = centerRepository.findNameById(centerId);

		Emergency emergency = Emergency.builder()
			.centerId(centerId)
			.title(request.title())
			.authorId(member.getId())
			.content(request.content())
			.dueDate(request.dueDate())
			.capacity(request.capacity())
			.targetGrade(request.targetGrade())
			.emergencyType(EmergencyType.VOLUNTEER)
			.build();

		eventPublisher.publishEvent(
			new EmergencyEvent(
				emergency.getId(),
				centerId,
				emergency.getTitle(),
				emergency.getContent(),
				centerName,
				emergency.getTargetGrade()
			)
		);

		return new EmergencyCreateResponse(emergencyRepository.save(emergency).getId());
	}

	@Transactional
	public EmergencyCreateResponse createDonationEmergency(
		EmergencyDonationRequest request,
		Member member,
		Long centerId
	) {
		CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		String centerName = centerRepository.findNameById(centerId);

		Emergency emergency = Emergency.builder()
			.centerId(centerId)
			.title(request.title())
			.authorId(member.getId())
			.content(request.content())
			.dueDate(request.dueDate())
			.targetAmount(request.targetAmount())
			.targetGrade(request.targetGrade())
			.emergencyType(EmergencyType.DONATION)
			.build();

		eventPublisher.publishEvent(
			new EmergencyEvent(
				emergency.getId(),
				centerId,
				emergency.getTitle(),
				emergency.getContent(),
				centerName,
				emergency.getTargetGrade()
			)
		);

		return new EmergencyCreateResponse(emergencyRepository.save(emergency).getId());
	}

	public List<EmergencyResponse> getEmergencyByCenter(Long centerId, EmergencyType type, Long memberId) {
		CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		Map<Long, EmergencyApplicationStatus> appliedEmergencies = emergencyApplicationRepository
			.getEmergencyApplicationsByMemberId(memberId)
			.stream()
			.collect(Collectors.toMap(
				AppliedEmergencies::emergencyId,
				AppliedEmergencies::status
			));

		List<EmergencyInfo> emergencyInfos = emergencyRepository
			.getEmergenciesByCenterId(centerId, type, LocalDateTime.now());

		List<EmergencyResponse> responses = new ArrayList<>();

		for (EmergencyInfo emergencyInfo : emergencyInfos) {
			EmergencyResponse response = new EmergencyResponse(
				emergencyInfo.emergencyId(),
				emergencyInfo.centerId(),
				emergencyInfo.authorId(),
				emergencyInfo.name(),
				emergencyInfo.title(),
				emergencyInfo.content(),
				emergencyInfo.memberImage(),
				emergencyInfo.dueDate(),
				emergencyInfo.capacity(),
				emergencyInfo.targetAmount(),
				emergencyInfo.type(),
				appliedEmergencies.getOrDefault(emergencyInfo.emergencyId(), null)
			);
		}

		return responses;
	}

	public EmergencyLatestResponse getLatestEmergencyByCenter(Long centerId, EmergencyType type) {
		Integer count = emergencyRepository.countEmergenciesByType(type, centerId);
		List<EmergencyResponse> emergencies = emergencyRepository.getLatestEmergenciesByCenterId(
				centerId,
				type,
				LocalDateTime.now()
		);

		return new EmergencyLatestResponse(count, emergencies);
	}

	public void deleteEmergency(Long emergencyId, Long centerId, Long memberId) {
		CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		emergencyRepository.deleteEmergencyById(emergencyId);
	}
}
