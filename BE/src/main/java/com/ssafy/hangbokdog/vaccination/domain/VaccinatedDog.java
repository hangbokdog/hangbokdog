package com.ssafy.hangbokdog.vaccination.domain;

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
public class VaccinatedDog extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "vaccinated_dog_id", nullable = false)
	private Long id;

	@Column(name = "dog_id", nullable = false)
	private Long dogId;

	@Column(name = "vaccination_id", nullable = false)
	private Long vaccinationId;

	@Builder
	public VaccinatedDog(Long vaccinationId, Long dogId) {
		this.vaccinationId = vaccinationId;
		this.dogId = dogId;
	}
}
