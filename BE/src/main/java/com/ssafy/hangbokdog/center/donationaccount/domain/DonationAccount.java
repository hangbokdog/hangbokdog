package com.ssafy.hangbokdog.center.donationaccount.domain;

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
public class DonationAccount extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "donation_account_id")
	private Long id;

	@Column(name = "centerId", nullable = false)
	private Long centerId;

	@Column(name = "balance", nullable = false)
	private Long balance;

	@Column(name = "last_updated_key")
	private Long lastUpdatedKey;

	public Long updateBalance(long amount, Long newLastUpdatedKey) {
		this.balance += amount;
		this.lastUpdatedKey = newLastUpdatedKey;
		return balance;
	}

	public static DonationAccount createDonationAccount(
		Long centerId,
		Long balance
	) {
		return new DonationAccount(
			centerId,
			balance
		);
	}

	private DonationAccount(
		Long centerId,
		Long balance
	) {
		this.centerId = centerId;
		this.balance = balance;
		this.lastUpdatedKey = 0L;
	}
}
