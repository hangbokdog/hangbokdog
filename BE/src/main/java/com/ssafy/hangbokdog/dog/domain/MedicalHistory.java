package com.ssafy.hangbokdog.dog.domain;

import org.hibernate.validator.constraints.Length;

import com.ssafy.hangbokdog.dog.domain.enums.MedicalType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class MedicalHistory extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "medical_history_id")
	private Long id;

	@Column(nullable = false, name = "dog_id")
	private Long dogId;

	@Length(max = 128)
	@Column(nullable = false, name = "content")
	private String content;

	@Column(nullable = false, name = "medical_period")
	private Integer medicalPeriod;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, name = "medical_type")
	private MedicalType medicalType;

	public static MedicalHistory createMedicalHistory(
		Long dogId,
		String content,
		Integer medicalPeriod,
		MedicalType medicalType
	) {
		return new MedicalHistory(
			dogId,
			content,
			medicalPeriod,
			medicalType
		);
	}

	private MedicalHistory(
		Long dogId,
		String content,
		Integer medicalPeriod,
		MedicalType medicalType
	) {
		this.dogId = dogId;
		this.content = content;
		this.medicalPeriod = medicalPeriod;
		this.medicalType = medicalType;
	}
}

