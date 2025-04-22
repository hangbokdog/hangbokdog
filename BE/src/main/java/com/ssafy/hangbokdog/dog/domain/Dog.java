package com.ssafy.hangbokdog.dog.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.Type;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.dog.domain.enums.DogStatus;
import com.ssafy.hangbokdog.dog.domain.enums.Gender;
import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Dog extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "dog_id")
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private DogStatus status;

	@Column(nullable = false, name = "center_id")
	private Long centerId;

	@Column(nullable = false, name = "name")
	private String name;

	@Type(JsonType.class)
	@Column(columnDefinition = "json")
	private JsonType color;

	@Column(name = "rescued_date")
	private LocalDateTime rescuedDate;

	@Column(name = "weight")
	private Double weight;

	@Column(name = "description")
	private String description;

	@Column(name = "is_star")
	private Boolean isStar;

	@Enumerated(EnumType.STRING)
	@Column(name = "gender")
	private Gender gender;

	@Column(name = "is_neutered")
	private Boolean isNeutered;
}
