package com.ssafy.hangbokdog.emergency.emergency.application;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;
import com.ssafy.hangbokdog.emergency.application.domain.repository.EmergencyApplicationRepository;
import com.ssafy.hangbokdog.emergency.emergency.domain.Emergency;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyType;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.TargetGrade;
import com.ssafy.hangbokdog.emergency.emergency.domain.repository.EmergencyRepository;
import com.ssafy.hangbokdog.emergency.emergency.dto.AppliedEmergencies;
import com.ssafy.hangbokdog.emergency.emergency.dto.EmergencyInfo;
import com.ssafy.hangbokdog.emergency.emergency.dto.request.EmergencyDonationRequest;
import com.ssafy.hangbokdog.emergency.emergency.dto.request.EmergencyTransportRequest;
import com.ssafy.hangbokdog.emergency.emergency.dto.request.EmergencyVolunteerRequest;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.EmergencyCreateResponse;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.EmergencyLatestResponse;
import com.ssafy.hangbokdog.emergency.emergency.dto.response.EmergencyResponse;
import com.ssafy.hangbokdog.fcm.domain.NotificationType;
import com.ssafy.hangbokdog.fcm.dto.event.EmergencyEvent;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.notification.domain.Notification;
import com.ssafy.hangbokdog.notification.domain.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmergencyService {

	private final EmergencyRepository emergencyRepository;
	private final CenterMemberRepository centerMemberRepository;
	private final ApplicationEventPublisher eventPublisher;
	private final CenterRepository centerRepository;
	private final EmergencyApplicationRepository emergencyApplicationRepository;
	private final NotificationRepository notificationRepository;

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

		List<Long> targetIds = new ArrayList<>();
		if (request.targetGrade().equals(TargetGrade.ALL)) {
			targetIds = centerMemberRepository.getTargetAllIds(centerId);
		} else if (request.targetGrade().equals(TargetGrade.MANAGER)) {
			targetIds = centerMemberRepository.getTargetIds(centerId, CenterGrade.MANAGER);
		} else if (request.targetGrade().equals(TargetGrade.USER)) {
			targetIds = centerMemberRepository.getTargetIds(centerId, CenterGrade.USER);
		}

		List<Notification> notifications = new ArrayList<>();

		for (Long targetId : targetIds) {
			Notification notification = Notification.builder()
					.content(request.content())
					.receiverId(targetId)
					.targetId(emergency.getId())
					.title(request.title())
					.type(NotificationType.EMERGENCY)
					.build();
			notifications.add(notification);
		}

		notificationRepository.bulkInsert(notifications);

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

		List<Long> targetIds = new ArrayList<>();
		if (request.targetGrade().equals(TargetGrade.ALL)) {
			targetIds = centerMemberRepository.getTargetAllIds(centerId);
		} else if (request.targetGrade().equals(TargetGrade.MANAGER)) {
			targetIds = centerMemberRepository.getTargetIds(centerId, CenterGrade.MANAGER);
		} else if (request.targetGrade().equals(TargetGrade.USER)) {
			targetIds = centerMemberRepository.getTargetIds(centerId, CenterGrade.USER);
		}

		List<Notification> notifications = new ArrayList<>();

		for (Long targetId : targetIds) {
			Notification notification = Notification.builder()
					.content(request.content())
					.receiverId(targetId)
					.targetId(emergency.getId())
					.title(request.title())
					.type(NotificationType.EMERGENCY)
					.build();
			notifications.add(notification);
		}

		notificationRepository.bulkInsert(notifications);

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

		//TODO: CenterGrade, TargetGrade 수정하고 이벤트에 타겟 이미 조회하니 같이 넘겨주기
		List<Long> targetIds = new ArrayList<>();
		if (request.targetGrade().equals(TargetGrade.ALL)) {
			targetIds = centerMemberRepository.getTargetAllIds(centerId);
		} else if (request.targetGrade().equals(TargetGrade.MANAGER)) {
			targetIds = centerMemberRepository.getTargetIds(centerId, CenterGrade.MANAGER);
		} else if (request.targetGrade().equals(TargetGrade.USER)) {
			targetIds = centerMemberRepository.getTargetIds(centerId, CenterGrade.USER);
		}

		List<Notification> notifications = new ArrayList<>();

		for (Long targetId : targetIds) {
			Notification notification = Notification.builder()
					.content(request.content())
					.receiverId(targetId)
					.targetId(emergency.getId())
					.title(request.title())
					.type(NotificationType.EMERGENCY)
					.build();
			notifications.add(notification);
		}

		notificationRepository.bulkInsert(notifications);

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
				appliedEmergencies.getOrDefault(emergencyInfo.emergencyId(), null),
					emergencyInfo.emergencyStatus()
			);
			responses.add(response);
		}

		return responses;
	}

	public EmergencyLatestResponse getLatestEmergencyByCenter(Long memberId, Long centerId, EmergencyType type) {
		Integer count = emergencyRepository.countEmergenciesByType(type, centerId);

		List<EmergencyInfo> emergencyInfos = emergencyRepository.getLatestEmergenciesByCenterId(
				centerId,
				type,
				LocalDateTime.now()
		);

		Map<Long, EmergencyApplicationStatus> appliedEmergencies = emergencyApplicationRepository
			.getEmergencyApplicationsByMemberId(memberId)
			.stream()
			.collect(Collectors.toMap(
				AppliedEmergencies::emergencyId,
				AppliedEmergencies::status
			));

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
				appliedEmergencies.getOrDefault(emergencyInfo.emergencyId(), null),
					emergencyInfo.emergencyStatus()
			);
			responses.add(response);
		}

		return new EmergencyLatestResponse(count, responses);
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
