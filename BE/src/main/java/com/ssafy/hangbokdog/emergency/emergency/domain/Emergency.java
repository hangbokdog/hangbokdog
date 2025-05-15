package com.ssafy.hangbokdog.emergency.emergency.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.EmergencyType;
import com.ssafy.hangbokdog.emergency.emergency.domain.enums.TargetGrade;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Emergency extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "emergency_id", nullable = false)
	private Long id;

	@Column(name = "author_id", nullable = false)
	private Long authorId;

	@Column(name = "center_id", nullable = false)
	private Long centerId;

	@Column(name = "due_date")
	private LocalDateTime dueDate;

	@Column(name = "title", nullable = false, length = 128)
	private String title;

	@Column(name = "content", nullable = false, length = 512)
	private String content;

	@Enumerated(EnumType.STRING)
	@Column(name = "target_grade", nullable = false)
	private TargetGrade targetGrade;

	@Column(name = "capacity")
	private Integer capacity;

	@Column(name = "target_amount")
	private Integer targetAmount;

	@Enumerated(EnumType.STRING)
	@Column(name = "emergency_type")
	private EmergencyType emergencyType;

	@Builder
	public Emergency(
		Long authorId,
		Long centerId,
		LocalDateTime dueDate,
		String title,
		String content,
		TargetGrade targetGrade,
		Integer capacity,
		Integer targetAmount,
		EmergencyType emergencyType
	) {
		this.authorId = authorId;
		this.centerId = centerId;
		this.dueDate = dueDate;
		this.title = title;
		this.content = content;
		this.targetGrade = targetGrade;
		this.capacity = capacity;
		this.targetAmount = targetAmount;
		this.emergencyType = emergencyType;
	}
}
