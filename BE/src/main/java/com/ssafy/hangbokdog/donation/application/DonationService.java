package com.ssafy.hangbokdog.donation.application;

import static com.ssafy.hangbokdog.donation.domain.DonationType.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.donation.domain.DonationHistory;
import com.ssafy.hangbokdog.donation.domain.repository.DonationHistoryRepository;
import com.ssafy.hangbokdog.donation.dto.request.DonationRequest;
import com.ssafy.hangbokdog.donation.dto.response.DonationHistoryResponse;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.mileage.domain.Mileage;
import com.ssafy.hangbokdog.mileage.domain.repository.MileageRepository;
import com.ssafy.hangbokdog.transaction.domain.Transaction;
import com.ssafy.hangbokdog.transaction.domain.TransactionType;
import com.ssafy.hangbokdog.transaction.domain.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonationService {

	private final DonationHistoryRepository donationHistoryRepository;
	private final MileageRepository mileageRepository;
	private final TransactionRepository transactionRepository;

	@Transactional
	public void donate(Member member, Long centerId, DonationRequest donationRequest) {
		Mileage mileage = mileageRepository.findByMemberId(member.getId())
			.orElseThrow(() -> new BadRequestException(ErrorCode.MILEAGE_NOT_FOUND));

		mileage.use(donationRequest.amount());

		donationHistoryRepository.save(
			DonationHistory.builder()
				.donorId(member.getId())
				.amount(donationRequest.amount())
				.type(DONATION)
				.centerId(centerId)
				.build()
		);

		transactionRepository.save(
			Transaction.builder()
				.type(TransactionType.DONATION)
				.amount(donationRequest.amount())
				.memberId(member.getId())
				.centerId(centerId)
				.build()
		);
	}

	public PageInfo<DonationHistoryResponse> findAll(Member member, Long centerId, String pageToken) {
		return donationHistoryRepository.findAllByDonorId(member.getId(), centerId, pageToken);
	}
}
