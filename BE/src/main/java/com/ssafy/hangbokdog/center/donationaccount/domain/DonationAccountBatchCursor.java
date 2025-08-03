package com.ssafy.hangbokdog.center.donationaccount.domain;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DonationAccountBatchCursor extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "donation_account_batch_cursor_id", nullable = false)
	private Long id;

	@Column(name = "center_id", nullable = false)
	private Long centerId;

	@Column(name = "last_updated_key", nullable = false)
	private Long lastUpdatedKey;

	@Builder
	public DonationAccountBatchCursor(
			Long centerId,
			Long lastUpdatedKey
	) {
		this.centerId = centerId;
		this.lastUpdatedKey = lastUpdatedKey;
	}

	public void updateKey(Long newKey) {
		this.lastUpdatedKey = newKey;
	}
}
