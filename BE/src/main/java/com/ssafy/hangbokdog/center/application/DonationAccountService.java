package com.ssafy.hangbokdog.center.application;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.center.domain.repository.DonationAccountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonationAccountService {

	private final DonationAccountRepository donationAccountRepository;

}
