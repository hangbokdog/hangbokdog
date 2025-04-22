package com.ssafy.hangbokdog.center.presentation;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.hangbokdog.center.application.CenterService;
import com.ssafy.hangbokdog.center.dto.request.CenterCreateRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/centers")
@RequiredArgsConstructor
public class CenterController {

	private final CenterService centerService;

	@PostMapping
	public ResponseEntity<Void> addCenter(@RequestBody CenterCreateRequest request) {

		Long centerId = centerService.createCenter(request);
		return ResponseEntity.created(URI.create("/api/v1/centers/" + centerId))
			.build();
	}
}
