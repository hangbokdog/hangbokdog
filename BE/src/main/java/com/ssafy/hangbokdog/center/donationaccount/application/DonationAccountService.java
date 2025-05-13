package com.ssafy.hangbokdog.center.donationaccount.application;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.center.dto.CenterKeyInfo;
import com.ssafy.hangbokdog.center.donationaccount.domain.DonationAccount;
import com.ssafy.hangbokdog.center.donationaccount.domain.repository.DonationAccountRepository;
import com.ssafy.hangbokdog.center.donationaccount.dto.response.DonationAccountBalanceResponse;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.transaction.domain.repository.TransactionRepository;
import com.ssafy.hangbokdog.transaction.dto.TransactionInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonationAccountService {

	private final DonationAccountRepository donationAccountRepository;
	private final TransactionRepository transactionRepository;
	private final CenterMemberRepository centerMemberRepository;

	public DonationAccountBalanceResponse getBalance(Long memberId, Long centerId) {

		CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_NOT_FOUND));

		if (!centerMember.getGrade().equals(CenterGrade.MANAGER)) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		DonationAccount donationAccount = getDonationAccount(centerId);

		return new DonationAccountBalanceResponse(donationAccount.getBalance());
	}

	@Transactional
	public void applyTransactionsToDonationAccount() {

		List<CenterKeyInfo> centerKeyInfos = donationAccountRepository.getCenterKeyInfos();

		Map<Long, TransactionInfo> transactionInfos = transactionRepository.getTransactionInfoByCenter(centerKeyInfos);

		donationAccountRepository.bulkUpdateDonationAccounts(transactionInfos);
	}

	private DonationAccount getDonationAccount(Long centerId) {
		return donationAccountRepository.getDonationAccountByCenterId(centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.DONATION_ACCOUNT_NOT_FOUND));
	}
}
