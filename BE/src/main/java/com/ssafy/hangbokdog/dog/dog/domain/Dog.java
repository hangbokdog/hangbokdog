package com.ssafy.hangbokdog.dog.dog.domain;

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

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogBreed;
import com.ssafy.hangbokdog.dog.dog.domain.enums.DogStatus;
import com.ssafy.hangbokdog.dog.dog.domain.enums.Gender;
import com.vladmihalcea.hibernate.type.json.JsonType;

import lombok.AccessLevel;
import lombok.Builder;
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

	@Column(nullable = false, name = "profile_image", length = 4096)
	private String profileImage;

	@Type(JsonType.class)
	@Column(nullable = false, columnDefinition = "json")
	private List<String> color;

	@Column(nullable = false, name = "rescued_date")
	private LocalDateTime rescuedDate;

	@Column(name = "weight")
	private Double weight;

	@Column(nullable = false, name = "description", length = 8192)
	private String description;

	@Column(nullable = false, name = "is_star")
	private Boolean isStar;

	@Column(name = "birth")
	private LocalDateTime birth;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, name = "gender")
	private Gender gender;

	@Column(nullable = false, name = "is_neutered")
	private Boolean isNeutered;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, name = "dog_breed")
	private DogBreed dogBreed;

	@Column(nullable = false, name = "location_id")
	private Long locationId;

	public void goFoster() {
		this.status = DogStatus.FOSTERED;
	}

	public void goAdopted() {
		this.status = DogStatus.ADOPTED;
	}

	public void goProtected() {
		this.status = DogStatus.PROTECTED;
	}

	public void dogToStar() {
		if (isStar) {
			throw new BadRequestException(ErrorCode.DOG_ALREADY_STAR);
		}
		this.isStar = true;
	}

	public void updateDog(
		String name,
		String profileImageUrl,
		Double weight,
		String description,
		Boolean isNeutered,
		Long locationId,
		DogBreed dogBreed,
		Boolean isStar
	) {
		this.name = name;
		this.profileImage = profileImageUrl;
		this.weight = weight;
		this.description = description;
		this.isNeutered = isNeutered;
		this.locationId = locationId;
		this.dogBreed = dogBreed;
		this.isStar = isStar;
	}

	@Builder
	public Dog(
		DogStatus status,
		Long centerId,
		String name,
		DogBreed dogBreed,
		String profileImage,
		List<String> color,
		LocalDateTime rescuedDate,
		Double weight,
		String description,
		Boolean isStar,
		LocalDateTime birth,
		Long locationId,
		Gender gender,
		Boolean isNeutered
	) {
		this.status = status;
		this.centerId = centerId;
		this.name = name;
		this.dogBreed = dogBreed;
		this.profileImage = profileImage;
		this.color = color;
		this.rescuedDate = rescuedDate;
		this.weight = weight;
		this.description = description;
		this.isStar = isStar;
		this.gender = gender;
		this.isNeutered = isNeutered;
		this.birth = birth;
		this.locationId = locationId;
	}
}
