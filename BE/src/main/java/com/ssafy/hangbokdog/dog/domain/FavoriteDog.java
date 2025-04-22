package com.ssafy.hangbokdog.dog.domain;

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
public class FavoriteDog extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "favorite_dog_id")
	private Long id;

	@Column(nullable = false, name = "member_id")
	private Long memberId;

	@Column(nullable = false, name = "dog_id")
	private Long dogId;

	public static FavoriteDog createFavoriteDog(
		Long memberId,
		Long dogId
	) {
		return new FavoriteDog(
			memberId,
			dogId
		);
	}

	private FavoriteDog(
		Long memberId,
		Long dogId
	) {
		this.memberId = memberId;
		this.dogId = dogId;
	}
}
