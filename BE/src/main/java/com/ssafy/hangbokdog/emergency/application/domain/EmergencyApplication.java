package com.ssafy.hangbokdog.emergency.application.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.emergency.application.domain.enums.EmergencyApplicationStatus;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class EmergencyApplication extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "emergency_application_id", nullable = false)
	private Long id;

	@Column(name = "emergency_id", nullable = false)
	private Long emergencyId;

	@Column(name = "applicant_id", nullable = false)
	private Long applicantId;

	@Column(name = "status", nullable = false)
	private EmergencyApplicationStatus status;

	public void approve() {
		if (status == EmergencyApplicationStatus.APPROVED) {
			throw new BadRequestException(ErrorCode.EMERGENCY_APPLICATION_ALREADY_APPROVED);
		}
		this.status = EmergencyApplicationStatus.APPROVED;
	}

	public void reject() {
		if (status == EmergencyApplicationStatus.REJECTED) {
			throw new BadRequestException(ErrorCode.EMERGENCY_APPLICATION_ALREADY_REJECTED);
		}
		this.status = EmergencyApplicationStatus.REJECTED;
	}

	public boolean isAuthor(Long memberId) {
		return applicantId.equals(memberId);
	}

	@Builder
	public EmergencyApplication(Long emergencyId, Long applicantId, EmergencyApplicationStatus status) {
		this.emergencyId = emergencyId;
		this.applicantId = applicantId;
		this.status = status;
	}
}
