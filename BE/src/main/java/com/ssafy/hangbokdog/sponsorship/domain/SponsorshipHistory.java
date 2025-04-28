package com.ssafy.hangbokdog.sponsorship.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.sponsorship.domain.enums.SponsorshipHistoryStatus;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class SponsorshipHistory extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "sponsorship_history_id", nullable = false)
	private Long id;

	@Column(name = "sponsorship_id", nullable = false)
	private Long sponsorshipId;

	@Column(name = "amount", nullable = false)
	private int amount;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private SponsorshipHistoryStatus status;

	public static SponsorshipHistory createSponsorshipHistory(
		Long sponsorshipId,
		int amount,
		SponsorshipHistoryStatus status
	) {
		return new SponsorshipHistory(
			sponsorshipId,
			amount,
			status
		);
	}

	private SponsorshipHistory(
		Long sponsorshipId,
		int amount,
		SponsorshipHistoryStatus status
	) {
		this.sponsorshipId = sponsorshipId;
		this.amount = amount;
		this.status = status;
	}
}
