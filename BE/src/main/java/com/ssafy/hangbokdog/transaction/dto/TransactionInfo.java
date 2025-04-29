package com.ssafy.hangbokdog.transaction.dto;

public record TransactionInfo(
	int count,
	Long sum,
	Long newLastUpdatedKey
) {
}
