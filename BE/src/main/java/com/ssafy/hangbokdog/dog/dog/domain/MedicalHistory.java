package com.ssafy.hangbokdog.dog.dog.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.dog.dog.domain.enums.MedicalType;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "medical_history")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class MedicalHistory extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "medical_history_id")
	private Long id;

	@Column(nullable = false, name = "dog_id")
	private Long dogId;

	@Column(name = "author_id", nullable = false)
	private Long authorId;

	@Column(name = "content", length = 8192)
	private String content;

	@Column(name = "medical_history_image", length = 256)
	private String medicalHistoryImage;

	@Column(name = "medical_period")
	private Integer medicalPeriod;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, name = "medical_type")
	private MedicalType medicalType;

	@Column(nullable = false, name = "operated_date")
	private LocalDateTime operatedDate;

	public boolean isAuthor(Long memberId) {
		return authorId.equals(memberId);
	}

	public void update(
			String content,
			String medicalHistoryImage,
			Integer medicalPeriod,
			MedicalType medicalType,
			LocalDateTime operatedDate
	) {
		this.content = content;
		this.medicalHistoryImage = medicalHistoryImage;
		this.medicalPeriod = medicalPeriod;
		this.medicalType = medicalType;
		this.operatedDate = operatedDate;
	}

	@Builder
	public MedicalHistory(
		Long dogId,
		Long authorId,
		String content,
		Integer medicalPeriod,
		MedicalType medicalType,
		LocalDateTime operatedDate,
		String medicalHistoryImage
	) {
		this.dogId = dogId;
		this.authorId = authorId;
		this.content = content;
		this.medicalPeriod = medicalPeriod;
		this.medicalType = medicalType;
		this.operatedDate = operatedDate;
		this.medicalHistoryImage = medicalHistoryImage;
	}
}

