package com.ssafy.hangbokdog.sponsorship.domain;

import com.ssafy.hangbokdog.sponsorship.domain.enums.SponsorShipStatus;
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
public class Sponsorship extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "sponsorship_id", nullable = false)
	private Long id;

	@Column(name = "member_id", nullable = false)
	private Long memberId;

	@Column(name = "dog_id", nullable = false)
	private Long dogId;

	@Column(name = "status", nullable = false)
	private SponsorShipStatus status;

	@Column(name = "amount", nullable = false)
	private Integer amount;
}
