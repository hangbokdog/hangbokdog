package com.ssafy.hangbokdog.vaccination.domain;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import org.hibernate.annotations.Type;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.vaccination.domain.enums.VaccinationStatus;
import com.vladmihalcea.hibernate.type.json.JsonType;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Vaccination extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "vaccination_id", nullable = false)
	private Long id;

	@Column(name = "center_id", nullable = false)
	private Long centerId;

	@Column(name = "author_id", nullable = false)
	private Long authorId;

	@Column(name = "title", nullable = false, length = 64)
	private String title;

	@Column(name = "content", nullable = false, length = 256)
	private String content;

	@Column(name = "operated_date", nullable = false)
	private LocalDateTime operatedDate;

	@Type(JsonType.class)
	@Column(nullable = false, columnDefinition = "json")
	private List<Long> locationIds;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private VaccinationStatus status;

	public void complete() {
		if (this.status.equals(VaccinationStatus.COMPLETED)) {
			throw new BadRequestException(ErrorCode.VACCINATION_ALREADY_COMPLETED);
		}
		this.status = VaccinationStatus.COMPLETED;
	}

	@Builder
	public Vaccination(
		Long centerId,
		Long authorId,
		String title,
		String content,
		LocalDateTime operatedDate,
		List<Long> locationIds,
		VaccinationStatus status
	) {
		this.centerId = centerId;
		this.authorId = authorId;
		this.title = title;
		this.content = content;
		this.operatedDate = operatedDate;
		this.locationIds = locationIds;
		this.status = status;
	}
}
