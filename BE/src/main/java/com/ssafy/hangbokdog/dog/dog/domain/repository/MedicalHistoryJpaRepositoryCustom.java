package com.ssafy.hangbokdog.dog.dog.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.dog.dog.dto.response.MedicalHistoryResponse;

public interface MedicalHistoryJpaRepositoryCustom {

	List<MedicalHistoryResponse> findAll(Long dogId, String pageToken, int pageSize);
}
