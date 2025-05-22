package com.ssafy.hangbokdog.transaction.dto;

public record TransactionInfo(
	Long centerId,
	int count,
	Long sum,
	Long newLastUpdatedKey
) {
}
