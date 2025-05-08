package com.ssafy.hangbokdog.dog.domain.repository;

import static com.ssafy.hangbokdog.dog.domain.QMedicalHistory.*;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.dog.dto.response.MedicalHistoryResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MedicalHistoryJpaRepositoryCustomImpl implements MedicalHistoryJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<MedicalHistoryResponse> findAll(
		Long dogId,
		String pageToken,
		int pageSize
	) {
		return queryFactory.select(
			Projections.constructor(
				MedicalHistoryResponse.class,
				medicalHistory.id,
				medicalHistory.content,
				medicalHistory.medicalPeriod,
				medicalHistory.medicalType,
				medicalHistory.operatedDate,
				medicalHistory.medicalHistoryImage
			))
			.from(medicalHistory)
			.where(medicalHistory.dogId.eq(dogId)
					.and(isInRange(pageToken)))
			.orderBy(medicalHistory.operatedDate.desc())
			.limit(pageSize + 1)
			.fetch();
	}

	private BooleanExpression isInRange(String pageToken) {
		if (pageToken == null) {
			return null;
		}

		return medicalHistory.operatedDate.lt(LocalDateTime.parse(pageToken));
	}
}
