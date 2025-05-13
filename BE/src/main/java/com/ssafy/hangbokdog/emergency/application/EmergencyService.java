package com.ssafy.hangbokdog.emergency.application;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.emergency.domain.Emergency;
import com.ssafy.hangbokdog.emergency.domain.enums.EmergencyType;
import com.ssafy.hangbokdog.emergency.domain.repository.EmergencyRepository;
import com.ssafy.hangbokdog.emergency.dto.request.EmergencyDonationRequest;
import com.ssafy.hangbokdog.emergency.dto.request.EmergencyTransportRequest;
import com.ssafy.hangbokdog.emergency.dto.request.EmergencyVolunteerRequest;
import com.ssafy.hangbokdog.emergency.dto.response.EmergencyCreateResponse;
import com.ssafy.hangbokdog.emergency.dto.response.EmergencyResponse;
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
			.title(request.title())
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
			.title(request.title())
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
			.title(request.title())
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

	public List<EmergencyResponse> getEmergencyByCenter(Long centerId, EmergencyType type) {
		return emergencyRepository.getEmergenciesByCenterId(centerId, type, LocalDateTime.now());
	}
}
