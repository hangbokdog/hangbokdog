package com.ssafy.hangbokdog.mileage.application;

import static com.ssafy.hangbokdog.common.exception.ErrorCode.*;
import static com.ssafy.hangbokdog.transaction.domain.TransactionType.CHARGE;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.mileage.domain.Mileage;
import com.ssafy.hangbokdog.mileage.domain.repository.MileageRepository;
import com.ssafy.hangbokdog.transaction.domain.Transaction;
import com.ssafy.hangbokdog.transaction.domain.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MileageService {

    private final MileageRepository mileageRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public void charge(Member member, int amount) {
        Mileage mileage = mileageRepository.findByMemberId(member.getId())
                .orElseThrow(() -> new BadRequestException(MILEAGE_NOT_FOUND));

        mileage.charge(amount);

        transactionRepository.save(
                Transaction.builder()
                        .type(CHARGE)
                        .memberId(member.getId())
                        .amount(amount)
                        .build()
        );
    }
}
