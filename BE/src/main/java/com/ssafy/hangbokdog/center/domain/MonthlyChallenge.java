package com.ssafy.hangbokdog.center.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class MonthlyChallenge extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "monthly_challenge_id")
	private Long id;

	@Column(name = "title", nullable = false)
	private String title;

	@Column(name = "center_id", nullable = false)
	private Long centerId;

	@Column(name = "target_amount", nullable = false)
	private int targetAmount;

	public void updateTargetAmount(int amount, String title) {
		this.targetAmount = amount;
		this.title = title;
	}

	@Builder
	public MonthlyChallenge(int targetAmount, String title, Long centerId) {
		this.targetAmount = targetAmount;
		this.title = title;
		this.centerId = centerId;
	}
}
