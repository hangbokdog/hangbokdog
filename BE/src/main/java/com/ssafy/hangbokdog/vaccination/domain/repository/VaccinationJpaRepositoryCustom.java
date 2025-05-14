package com.ssafy.hangbokdog.vaccination.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.vaccination.dto.VaccinationDetailInfo;
import com.ssafy.hangbokdog.vaccination.dto.VaccinationSummaryInfo;

public interface VaccinationJpaRepositoryCustom {

	VaccinationDetailInfo getVaccinationDetail(Long vaccinationId);

	List<VaccinationSummaryInfo> getVaccinationSummariesByCenterId(Long centerId, String pageToken, int pageSize);
}
