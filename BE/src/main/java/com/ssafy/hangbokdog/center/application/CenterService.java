package com.ssafy.hangbokdog.center.application;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.center.domain.Center;
import com.ssafy.hangbokdog.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.center.dto.request.CenterCreateRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CenterService {

	private final CenterRepository centerRepository;

	public Long createCenter(CenterCreateRequest request) {
		Center center = Center.create(request.name());

		Long centerId = centerRepository.create(center).getId();

		return centerId;
	}
}
