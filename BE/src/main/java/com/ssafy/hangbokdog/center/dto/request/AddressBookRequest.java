package com.ssafy.hangbokdog.center.dto.request;

public record AddressBookRequest(
	String addressName,
	String address,
	Long locationId,
	Long newLocationId
) {
}
