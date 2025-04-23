package com.ssafy.hangbokdog.foster.domain;

import com.ssafy.hangbokdog.foster.domain.enums.FosterStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.ssafy.hangbokdog.common.entity.BaseEntity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Foster extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "foster_id")
	private Long id;

	@Column(name = "memberId", nullable = false)
	private Long memberId;

	@Column(name = "dogId", nullable = false)
	private Long dogId;

	@Column(name = "status", nullable = false)
	private FosterStatus status;

	public static Foster createFoster(
		Long memberId,
		Long dogId,
		FosterStatus status
	) {
		return new Foster(
			memberId,
			dogId,
			status
		);
	}

	private Foster(
		Long memberId,
		Long dogId,
		FosterStatus status
	) {
		this.memberId = memberId;
		this.dogId = dogId;
		this.status = status;
	}
}
