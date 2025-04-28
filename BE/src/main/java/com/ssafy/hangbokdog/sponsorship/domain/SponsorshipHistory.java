package com.ssafy.hangbokdog.sponsorship.domain;

import com.ssafy.hangbokdog.sponsorship.domain.enums.SponsorshipHistoryStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.ssafy.hangbokdog.common.entity.BaseEntity;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SponsorshipHistory extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "sponsorship_history_id", nullable = false)
	private Long id;

	@Column(name = "amount", nullable = false)
	private Long amount;

	@Column(name = "status", nullable = false)
	private SponsorshipHistoryStatus status;

	public SponsorshipHistory createSponsorshipHistory(
		Long amount,
		SponsorshipHistoryStatus status
	) {
		return new SponsorshipHistory(
			amount,
			status
		);
	}

	private SponsorshipHistory(
		Long amount,
		SponsorshipHistoryStatus status
	) {
		this.amount = amount;
		this.status = status;
	}
}
