package com.ssafy.hangbokdog.sponsorship.application;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.mileage.domain.repository.MileageRepository;
import com.ssafy.hangbokdog.sponsorship.domain.Sponsorship;
import com.ssafy.hangbokdog.sponsorship.domain.enums.SponsorShipStatus;
import com.ssafy.hangbokdog.sponsorship.domain.repository.SponsorshipRepository;
import com.ssafy.hangbokdog.sponsorship.dto.ActiveSponsorshipInfo;
import com.ssafy.hangbokdog.sponsorship.dto.FailedSponsorshipInfo;
import com.ssafy.hangbokdog.sponsorship.dto.response.SponsorshipResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SponsorshipService {

	private final SponsorshipRepository sponsorshipRepository;
	private final MileageRepository mileageRepository;
	private final DogRepository dogRepository;

	public Long applySponsorship(Long memberId, Long dogId) {

		if (!dogRepository.checkDogExistence(dogId)) {
			throw new BadRequestException(ErrorCode.DOG_NOT_FOUND);
		}

		if (sponsorshipRepository.countActiveSponsorshipByDogId(dogId) >= 2) {
			throw new BadRequestException(ErrorCode.FULL_SPONSORSHIP);
		}

		//TODO: 센터별 후원금액 가져오기
		Sponsorship sponsorship = Sponsorship.createSponsorship(
			memberId,
			dogId,
			25000L
		);

		return sponsorshipRepository.createSponsorship(sponsorship).getId();
	}

	@Transactional
	public void cancelSponsorship(Long memberId, Long sponsorshipId) {
		Sponsorship sponsorship = sponsorshipRepository.findSponsorshipById(sponsorshipId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.SPONSORSHIP_NOT_FOUND));

		sponsorship.validateOwner(memberId);

		sponsorship.cancelSponsorship();
	}

	@Transactional
	public void manageSponsorship(Long sponsorshipId, SponsorShipStatus request) {
		Sponsorship sponsorship = sponsorshipRepository.findSponsorshipById(sponsorshipId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.SPONSORSHIP_NOT_FOUND));

		switch (request) {
			case ACTIVE:
				sponsorship.activateSponsorship();
				break;

			case SUSPENDED:
				sponsorship.suspendSponsorship();
				break;

			case COMPLETED:
				sponsorship.completeSponsorship();
				break;
		}
	}

	@Transactional
	public SponsorshipResponse proceedSponsorship() {
		List<ActiveSponsorshipInfo> activeSponsorshipInfos = sponsorshipRepository.getActiveSponsorships();

		Map<Long, Long> memberBalance = activeSponsorshipInfos
			.stream()
			.collect(Collectors.toMap(
				ActiveSponsorshipInfo::memberId,
				ActiveSponsorshipInfo::balance,
				(oldValue, newValue) -> oldValue
			));

		int succeededSponsorshipCount = 0;
		Map<Long, Long> succeededSponsorshipInfos = new HashMap<>();
		List<FailedSponsorshipInfo> failedSponsorshipList = new ArrayList<>();

		for (ActiveSponsorshipInfo info : activeSponsorshipInfos) {
			if (info.amount() > memberBalance.get(info.memberId())) {
				failedSponsorshipList.add(new FailedSponsorshipInfo(
					info.memberId(),
					info.memberName(),
					info.dogId(),
					info.dogName(),
					info.amount(),
					info.mileageId()
				));
			} else {
				succeededSponsorshipCount++;
				memberBalance.put(info.memberId(), memberBalance.get(info.memberId()) - info.amount());
				succeededSponsorshipInfos.put(
					info.memberId(),
					succeededSponsorshipInfos.getOrDefault(info.memberId(), 0L) + info.amount()
				);
			}
		}

		if (!succeededSponsorshipInfos.isEmpty()) {
			mileageRepository.bulkUpdateMileageBalances(succeededSponsorshipInfos);
		}

		return new SponsorshipResponse(
			succeededSponsorshipCount,
			failedSponsorshipList.size(),
			failedSponsorshipList
		);
	}
}
