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
	@Column(name = "center_id")
	private Long id;

	@Column(name = "name")
	private String name;

	public static Center create(String name) {
		return new Center(name);
	}

	private Center(
		String name
	) {
		this.name = name;
	}
}
