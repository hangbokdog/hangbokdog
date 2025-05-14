package com.ssafy.hangbokdog.adoption.domain;

import com.ssafy.hangbokdog.adoption.domain.enums.AdoptionStatus;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.ssafy.hangbokdog.common.entity.BaseEntity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Adoption extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "adoption_id")
	private Long id;

	@Column(name = "dog_id", nullable = false)
	private Long dogId;

	@Column(name = "member_id", nullable = false)
	private Long memberId;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private AdoptionStatus status;

	public void accept() {
		if (this.status == AdoptionStatus.ACCEPTED) {
			throw new BadRequestException(ErrorCode.ADOPTION_ALREADY_ACCEPTED);
		}
		this.status = AdoptionStatus.ACCEPTED;
	}

	public void reject() {
		if (this.status == AdoptionStatus.REJECTED) {
			throw new BadRequestException(ErrorCode.ADOPTION_ALREADY_REJECTED);
		}
		this.status = AdoptionStatus.REJECTED;
	}

	@Builder
	public Adoption(
		Long dogId,
		Long memberId,
		AdoptionStatus status
	) {
		this.dogId = dogId;
		this.memberId = memberId;
		this.status = status;
	}
}
