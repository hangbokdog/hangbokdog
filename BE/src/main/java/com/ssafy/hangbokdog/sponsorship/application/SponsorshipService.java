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
import com.ssafy.hangbokdog.dog.dto.DogCenterInfo;
import com.ssafy.hangbokdog.donation.domain.DonationHistory;
import com.ssafy.hangbokdog.donation.domain.DonationType;
import com.ssafy.hangbokdog.donation.domain.repository.DonationHistoryRepository;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.mileage.domain.Mileage;
import com.ssafy.hangbokdog.mileage.domain.repository.MileageRepository;
import com.ssafy.hangbokdog.sponsorship.domain.Sponsorship;
import com.ssafy.hangbokdog.sponsorship.domain.SponsorshipHistory;
import com.ssafy.hangbokdog.sponsorship.domain.enums.SponsorShipStatus;
import com.ssafy.hangbokdog.sponsorship.domain.enums.SponsorshipHistoryStatus;
import com.ssafy.hangbokdog.sponsorship.domain.repository.SponsorshipHistoryRepository;
import com.ssafy.hangbokdog.sponsorship.domain.repository.SponsorshipRepository;
import com.ssafy.hangbokdog.sponsorship.dto.ActiveSponsorshipInfo;
import com.ssafy.hangbokdog.sponsorship.dto.FailedSponsorshipInfo;
import com.ssafy.hangbokdog.sponsorship.dto.response.FailedSponsorshipResponse;
import com.ssafy.hangbokdog.sponsorship.dto.response.MySponsorshipResponse;
import com.ssafy.hangbokdog.sponsorship.dto.response.SponsorshipResponse;
import com.ssafy.hangbokdog.transaction.domain.Transaction;
import com.ssafy.hangbokdog.transaction.domain.TransactionType;
import com.ssafy.hangbokdog.transaction.domain.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SponsorshipService {

	private final SponsorshipRepository sponsorshipRepository;
	private final SponsorshipHistoryRepository sponsorshipHistoryRepository;
	private final MileageRepository mileageRepository;
	private final DogRepository dogRepository;
	private final TransactionRepository transactionRepository;
	private final DonationHistoryRepository donationHistoryRepository;

	public Long applySponsorship(Long memberId, Long dogId) {

		if (!dogRepository.checkDogExistence(dogId)) {
			throw new BadRequestException(ErrorCode.DOG_NOT_FOUND);
		}

		if (sponsorshipRepository.countActiveSponsorshipByDogId(dogId) >= 2) {
			throw new BadRequestException(ErrorCode.FULL_SPONSORSHIP);
		}

		DogCenterInfo dogCenterInfo = dogRepository.getDogCenterInfo(dogId);

		Sponsorship sponsorship = Sponsorship.createSponsorship(
			memberId,
			dogId,
			dogCenterInfo.sponsorshipAmount()
		);

		return sponsorshipRepository.createSponsorship(sponsorship).getId();
	}

	@Transactional
	public void cancelSponsorship(Long memberId, Long sponsorshipId) {
		//TODO: 해당 센터 관리자인지 검증
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
		List<SponsorshipHistory> sponsorshipHistories = new ArrayList<>();
		List<Transaction> transactions = new ArrayList<>();
		List<DonationHistory> donationHistories = new ArrayList<>();

		Map<Long, Long> memberBalance = activeSponsorshipInfos
			.stream()
			.collect(Collectors.toMap(
				ActiveSponsorshipInfo::memberId,
				ActiveSponsorshipInfo::balance,
				(oldValue, newValue) -> oldValue
			));

		int succeededSponsorshipCount = 0;
		Map<Long, Long> succeededSponsorshipInfos = new HashMap<>();
		List<FailedSponsorshipInfo> failedSponsorships = new ArrayList<>();

		for (ActiveSponsorshipInfo info : activeSponsorshipInfos) {
			if (info.amount() > memberBalance.get(info.memberId())) {
				failedSponsorships.add(new FailedSponsorshipInfo(
					info.memberId(),
					info.memberName(),
					info.dogId(),
					info.dogName(),
					info.amount(),
					info.sponsorshipId()
				));

				SponsorshipHistory sponsorshipHistory = SponsorshipHistory.createSponsorshipHistory(
					info.sponsorshipId(),
					info.amount(),
					SponsorshipHistoryStatus.FAILED
				);

				sponsorshipHistories.add(sponsorshipHistory);
			} else {
				succeededSponsorshipCount++;

				memberBalance.put(info.memberId(), memberBalance.get(info.memberId()) - info.amount());

				succeededSponsorshipInfos.put(
					info.memberId(),
					succeededSponsorshipInfos.getOrDefault(info.memberId(), 0L) + info.amount()
				);

				SponsorshipHistory sponsorshipHistory = SponsorshipHistory.createSponsorshipHistory(
					info.sponsorshipId(),
					info.amount(),
					SponsorshipHistoryStatus.COMPLETED
				);

				DonationHistory donationHistory = DonationHistory.builder()
					.donorId(info.memberId())
					.amount(info.amount())
					.type(DonationType.SPONSORSHIP)
					.centerId(info.centerId())
					.build();

				Transaction transaction = Transaction.builder()
					.type(TransactionType.SPONSORSHIP)
					.amount(info.amount())
					.memberId(info.memberId())
					.centerId(info.centerId())
					.build();

				donationHistories.add(donationHistory);
				transactions.add(transaction);
				sponsorshipHistories.add(sponsorshipHistory);
			}
		}

		if (!succeededSponsorshipInfos.isEmpty()) {
			mileageRepository.bulkUpdateMileageBalances(succeededSponsorshipInfos);
		}

		if (!failedSponsorships.isEmpty()) {
			sponsorshipRepository.bulkUpdateSponsorshipStatus(
				failedSponsorships
					.stream()
					.map(FailedSponsorshipInfo::sponsorshipId)
					.collect(Collectors.toList())
			);
		}

		donationHistoryRepository.bulkInsert(donationHistories);
		sponsorshipHistoryRepository.bulkInsertSponsorshipHistory(sponsorshipHistories);
		transactionRepository.bulkInsert(transactions);

		return new SponsorshipResponse(
			succeededSponsorshipCount,
			failedSponsorships.size(),
			failedSponsorships
		);
	}

	public List<FailedSponsorshipResponse> getFailedSponsorships(Member member) {
		return sponsorshipRepository.getFailedSponsorships(member.getId());
	}

	@Transactional
	public void payFailedSponsorship(Member member, Long sponsorshipId) {
		Sponsorship failedSponsorship = sponsorshipRepository.findSponsorshipById(sponsorshipId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.SPONSORSHIP_NOT_FOUND));

		if (!member.getId().equals(failedSponsorship.getMemberId())) {
			throw new BadRequestException(ErrorCode.SPONSORSHIP_NOT_AUTHOR);
		}

		Mileage memberMileage = mileageRepository.findByMemberId(member.getId())
			.orElseThrow(() -> new BadRequestException(ErrorCode.MILEAGE_NOT_FOUND));

		memberMileage.use(failedSponsorship.getAmount());

		SponsorshipHistory sponsorshipHistory = SponsorshipHistory.createSponsorshipHistory(
			failedSponsorship.getId(),
			failedSponsorship.getAmount(),
			SponsorshipHistoryStatus.COMPLETED
		);

		Transaction transaction = Transaction.builder()
			.type(TransactionType.SPONSORSHIP)
			.amount(failedSponsorship.getAmount())
			.memberId(member.getId())
			.build();

		DonationHistory donationHistory = DonationHistory.builder()
			.type(DonationType.SPONSORSHIP)
			.amount(failedSponsorship.getAmount())
			.donorId(member.getId())
			.build();

		donationHistoryRepository.save(donationHistory);
		sponsorshipHistoryRepository.saveSponsorshipHistory(sponsorshipHistory);
		transactionRepository.save(transaction);

		failedSponsorship.activateSponsorship();
	}

	public List<MySponsorshipResponse> getMySponsorships(Member member) {
		return sponsorshipRepository.getMySponsorships(member.getId());
	}
}
