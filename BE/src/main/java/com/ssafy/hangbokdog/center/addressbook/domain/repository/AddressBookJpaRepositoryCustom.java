package com.ssafy.hangbokdog.center.addressbook.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.center.addressbook.dto.response.AddressBookResponse;
import com.ssafy.hangbokdog.vaccination.dto.LocationInfo;

public interface AddressBookJpaRepositoryCustom {

	List<AddressBookResponse> getAddressBookByCenter(Long centerId);

	List<LocationInfo> getLocationInfosIn(List<Long> locationIds);
}
