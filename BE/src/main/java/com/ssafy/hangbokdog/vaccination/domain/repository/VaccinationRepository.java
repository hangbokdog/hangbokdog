package com.ssafy.hangbokdog.vaccination.domain.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.vaccination.domain.Vaccination;
import com.ssafy.hangbokdog.vaccination.dto.VaccinationDetailInfo;
import com.ssafy.hangbokdog.vaccination.dto.VaccinationSummaryInfo;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VaccinationRepository {

	private static final int VACCINATION_PAGE_SIZE = 10;

	private final VaccinationJpaRepository vaccinationJpaRepository;
	private final VaccinatedDogJpaRepository vaccinatedDogJpaRepository;
	private final VaccinatedDogJdbcRepository vaccinatedDogJdbcRepository;

	public Vaccination save(Vaccination vaccination) {
		return vaccinationJpaRepository.save(vaccination);
	}

	public Optional<Vaccination> getVaccinationById(Long vaccinationId) {
		return vaccinationJpaRepository.findById(vaccinationId);
	}

	public VaccinationDetailInfo getVaccinationDetailInfo(Long vaccinationId) {
		return vaccinationJpaRepository.getVaccinationDetail(vaccinationId);
	}

	public Integer countVaccinationByVaccinationId(Long vaccinationId) {
		return vaccinatedDogJpaRepository.countByVaccinationId(vaccinationId);
	}

	public void bulkInsertVaccinatedDog(List<Long> dogIds, Long vaccinationId) {
		vaccinatedDogJdbcRepository.bulkInsertVaccinatedDog(dogIds, vaccinationId);
	}

	public PageInfo<VaccinationSummaryInfo> getVaccinationSummaryByCenterId(
		Long centerId,
		String pageToken
	) {
		var data = vaccinationJpaRepository.getVaccinationSummariesByCenterId(centerId, pageToken, VACCINATION_PAGE_SIZE);
		return PageInfo.of(data, VACCINATION_PAGE_SIZE, VaccinationSummaryInfo::vaccinationId);
	}
}
