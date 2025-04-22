package com.ssafy.hangbokdog.dog.domain;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import org.hibernate.annotations.Type;
import org.hibernate.validator.constraints.Length;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.dog.domain.enums.DogStatus;
import com.ssafy.hangbokdog.dog.domain.enums.Gender;
import com.vladmihalcea.hibernate.type.json.JsonType;

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

	@Column(nullable = false, name = "profile_image")
	private String profileImage;

	@Type(JsonType.class)
	@Column(columnDefinition = "json")
	private List<String> color;

	@Column(name = "rescued_date")
	private LocalDateTime rescuedDate;

	@Column(name = "weight")
	private Double weight;

	@Length(max = 256)
	@Column(name = "description")
	private String description;

	@Column(name = "is_star")
	private Boolean isStar;

	@Enumerated(EnumType.STRING)
	@Column(name = "gender")
	private Gender gender;

	@Column(name = "is_neutered")
	private Boolean isNeutered;

	public static Dog createDog(
		DogStatus status,
		Long centerId,
		String name,
		String profileImage,
		List<String> color,
		LocalDateTime rescuedDate,
		Double weight,
		String description,
		Boolean isStar,
		Gender gender,
		Boolean isNeutered
	) {
		return new Dog(
			status,
			centerId,
			name,
			profileImage,
			color,
			rescuedDate,
			weight,
			description,
			isStar,
			gender,
			isNeutered
		);
	}

	private Dog(
		DogStatus status,
		Long centerId,
		String name,
		String profileImage,
		List<String> color,
		LocalDateTime rescuedDate,
		Double weight,
		String description,
		Boolean isStar,
		Gender gender,
		Boolean isNeutered
	) {
		this.status = status;
		this.centerId = centerId;
		this.name = name;
		this.profileImage = profileImage;
		this.color = color;
		this.rescuedDate = rescuedDate;
		this.weight = weight;
		this.description = description;
		this.isStar = isStar;
		this.gender = gender;
		this.isNeutered = isNeutered;
	}
}
