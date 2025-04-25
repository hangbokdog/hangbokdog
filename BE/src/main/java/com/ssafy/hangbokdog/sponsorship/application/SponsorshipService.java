package com.ssafy.hangbokdog.sponsorship.application;

import org.springframework.stereotype.Service;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.sponsorship.domain.Sponsorship;
import com.ssafy.hangbokdog.sponsorship.domain.repository.SponsorshipRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SponsorshipService {

	private final SponsorshipRepository sponsorshipRepository;
	private final DogRepository dogRepository;

	public Long applySponsorship(Long memberId, Long dogId) {

		if (!dogRepository.checkDogExistence(dogId)) {
			throw new BadRequestException(ErrorCode.DOG_NOT_FOUND);
		}

		if (sponsorshipRepository.countActiveSponsorshipByDogId(dogId) >= 2) {
			throw new BadRequestException(ErrorCode.FULL_SPONSORSHIP);
		}

		Sponsorship sponsorship = Sponsorship.createSponsorship(
			memberId,
			dogId,
			25000
		);

		return sponsorshipRepository.createSponsorship(sponsorship).getId();
	}
}
