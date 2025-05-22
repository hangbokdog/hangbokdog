package com.ssafy.hangbokdog.center.center.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;
import com.ssafy.hangbokdog.common.entity.BaseEntity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"member_id", "center_id"})})
public class CenterMember extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "center_member_id")
	private Long id;

	@Column(name = "member_id", nullable = false)
	private Long memberId;

	@Column(name = "center_id", nullable = false)
	private Long centerId;

	@Enumerated(EnumType.STRING)
	@Column(name = "grade", nullable = false)
	private CenterGrade grade;

	@Column(name = "main", nullable = false)
	private boolean main;

	@Builder
	public CenterMember(
		Long id,
		Long memberId,
		Long centerId
	) {
		this.id = id;
		this.memberId = memberId;
		this.centerId = centerId;
		this.grade = CenterGrade.USER;
		this.main = false;
	}

	public boolean isManager() {
		return grade == CenterGrade.MANAGER;
	}

	public void makeMain() {
		this.main = true;
	}

	public void cancelMain() {
		this.main = false;
	}

	public void promote() {
		grade = CenterGrade.MANAGER;
	}

	public boolean isSelf(Long loginId) {
		return memberId.equals(loginId);
	}
}
