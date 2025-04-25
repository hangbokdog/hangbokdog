package com.ssafy.hangbokdog.sponsorship.domain;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.sponsorship.domain.enums.SponsorShipStatus;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
	name = "sponsorship",
	uniqueConstraints = {
		@jakarta.persistence.UniqueConstraint(columnNames = {"member_id", "dog_id"})
	}
)
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

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private SponsorShipStatus status;

	@Column(name = "amount", nullable = false)
	private Integer amount;

	public void validateOwner(Long memberId) {
		if (memberId.equals(this.memberId)) {
			throw new BadRequestException(ErrorCode.SPONSORSHIP_NOT_AUTHOR);
		}
	}

	public void cancelSponsorship() {
		if (this.status == SponsorShipStatus.CANCELLED) {
			throw new BadRequestException(ErrorCode.ALREADY_CANCELLED_SPONSORSHIP);
		}
		this.status = SponsorShipStatus.CANCELLED;
	}

	public void activateSponsorship() {
		if (this.status != SponsorShipStatus.PENDING && this.status != SponsorShipStatus.SUSPENDED && this.status != SponsorShipStatus.FAILED) {
			throw new BadRequestException(ErrorCode.NOT_VALID_FOSTER_APPLICATION);
		}
		this.status = SponsorShipStatus.ACTIVE;
	}

	public void suspendSponsorship() {
		if (this.status != SponsorShipStatus.ACTIVE) {
			throw new BadRequestException(ErrorCode.NOT_VALID_FOSTER_APPLICATION);
		}
		this.status = SponsorShipStatus.SUSPENDED;
	}

	public void completeSponsorship() {
		if (this.status != SponsorShipStatus.ACTIVE) {
			throw new BadRequestException(ErrorCode.NOT_VALID_FOSTER_APPLICATION);
		}
		this.status = SponsorShipStatus.COMPLETED;
	}

	public static Sponsorship createSponsorship(
		Long memberId,
		Long dogId,
		Integer amount
	) {
		return new Sponsorship(memberId, dogId, amount);
	}

	private Sponsorship(
		Long memberId,
		Long dogId,
		Integer amount
	) {
		this.memberId = memberId;
		this.dogId = dogId;
		this.status = SponsorShipStatus.PENDING;
		this.amount = amount;
	}
}
