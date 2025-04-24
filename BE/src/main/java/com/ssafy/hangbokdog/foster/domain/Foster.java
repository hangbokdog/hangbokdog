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

import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
	name = "foster",
	uniqueConstraints = {
		@jakarta.persistence.UniqueConstraint(columnNames = {"member_id", "dog_id"})
	}
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Foster extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "foster_id")
	private Long id;

	@Column(name = "member_id", nullable = false)
	private Long memberId;

	@Column(name = "dog_id", nullable = false)
	private Long dogId;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private FosterStatus status;

	public boolean checkApplying() {
		return this.status == FosterStatus.APPLYING;
	}

	public boolean checkAccepted() {
		return this.status == FosterStatus.ACCEPTED;
	}

	public boolean checkFostering() {
		return this.status == FosterStatus.FOSTERING;
	}

	public void acceptFosterApplication() {
		this.status = FosterStatus.ACCEPTED;
	}

	public void rejectFosterApplication() {
		this.status = FosterStatus.REJECTED;
	}

	public void cancelFosterApplication() {
		this.status = FosterStatus.CANCELLED;
	}

	public void startFoster() {
		this.status = FosterStatus.FOSTERING;
	}

	public void completeFoster() {
		this.status = FosterStatus.COMPLETED;
	}

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
