package com.ssafy.hangbokdog.center.dto.response;

import java.time.LocalDateTime;

public record DonationAccountReportResponse(
	Long beforeBalance,
	Long afterBalance,
	int appliedTransactions,
	LocalDateTime appliedDate
) {
}
