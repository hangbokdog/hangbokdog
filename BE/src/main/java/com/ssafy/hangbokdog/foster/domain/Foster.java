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
		if (this.status != FosterStatus.APPLYING) {
			return false;
		}
		return true;
	}

	public void acceptFoster() {
		this.status = FosterStatus.COMPLETED;
	}

	public void rejectFoster() {
		this.status = FosterStatus.REJECTED;
	}

	public void cancelFoster() {
		this.status = FosterStatus.CANCELLED;
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
