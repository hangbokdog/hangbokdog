package com.ssafy.hangbokdog.center.addressbook.dto.response;

public record AddressBookAppliedCountResponse(
        Long id,
        String addressName,
        String address,
        int appliedCount
) {
    public static AddressBookAppliedCountResponse of(
            Long id,
            String addressName,
            String address,
            int appliedCount
    ) {
        return new AddressBookAppliedCountResponse(
                id,
                addressName,
                address,
                appliedCount
        );
    }
}
