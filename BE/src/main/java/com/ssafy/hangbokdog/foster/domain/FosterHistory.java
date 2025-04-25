package com.ssafy.hangbokdog.foster.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.foster.domain.enums.FosterStatus;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class FosterHistory extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "foster_history_id", nullable = false)
	private Long id;

	@Column(name = "member_id", nullable = false)
	private Long memberId;

	@Column(name = "dog_id", nullable = false)
	private Long dogId;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private FosterStatus status;

	public static FosterHistory createFosterHistory(
		Long memberId,
		Long dogId,
		FosterStatus status
	) {
		return new FosterHistory(memberId, dogId, status);
	}

	private FosterHistory(
		Long memberId,
		Long dogId,
		FosterStatus status
	) {
		this.memberId = memberId;
		this.dogId = dogId;
		this.status = status;
	}
}
