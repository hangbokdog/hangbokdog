package com.ssafy.hangbokdog.center.domain;

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
public class Center extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "center_id", nullable = false)
	private Long id;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "sponsor_amount")
	private int sponsorAmount;

	public static Center create(String name, int sponsorAmount) {
		return new Center(name, sponsorAmount);
	}

	private Center(
		String name,
		int sponsorAmount
	) {
		this.name = name;
		this.sponsorAmount = sponsorAmount;
	}
}
