package com.ssafy.hangbokdog.center.addressbook.domain;

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
public class AddressBook extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "address_book_id")
	private Long id;

	@Column(name = "center_id", nullable = false)
	private Long centerId;

	@Column(name = "address_name", nullable = false, length = 48)
	private String addressName;

	@Column(name = "address", nullable = false, length = 256)
	private String address;


	public void updateAddress(String addressName, String address) {
		this.addressName = addressName;
		this.address = address;
	}

	@Builder
	public AddressBook(
		Long centerId,
		String addressName,
		String address
	) {
		this.centerId = centerId;
		this.addressName = addressName;
		this.address = address;
	}
}
