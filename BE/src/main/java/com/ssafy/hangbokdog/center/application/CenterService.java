package com.ssafy.hangbokdog.center.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.domain.Center;
import com.ssafy.hangbokdog.center.domain.DonationAccount;
import com.ssafy.hangbokdog.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.center.domain.repository.DonationAccountRepository;
import com.ssafy.hangbokdog.center.dto.request.CenterCreateRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CenterService {

	private final CenterRepository centerRepository;
	private final DonationAccountRepository donationAccountRepository;

	@Transactional
	public Long createCenter(CenterCreateRequest request) {

		Long centerId = centerRepository.create(Center.create(
			request.name(),
			request.sponsorAmount()
		)).getId();

		donationAccountRepository.createDonationAccount(DonationAccount.createDonationAccount(
			centerId,
			0L,
			null
		));

		return centerId;
	}
}
