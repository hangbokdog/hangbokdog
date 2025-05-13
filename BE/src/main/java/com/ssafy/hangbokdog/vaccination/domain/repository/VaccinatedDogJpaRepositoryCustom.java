package com.ssafy.hangbokdog.vaccination.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.vaccination.dto.response.VaccinationDoneResponse;

public interface VaccinatedDogJpaRepositoryCustom {
	List<VaccinationDoneResponse> getVaccinationDogsByVaccinationId(Long vaccinationId, String pageToken, int pageSize);
}
