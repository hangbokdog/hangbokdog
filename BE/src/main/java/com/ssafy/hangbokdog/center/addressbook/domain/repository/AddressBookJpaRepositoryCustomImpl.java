package com.ssafy.hangbokdog.center.addressbook.domain.repository;

import static com.ssafy.hangbokdog.center.addressbook.domain.QAddressBook.*;
import static com.ssafy.hangbokdog.volunteer.event.domain.QVolunteerEvent.volunteerEvent;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.center.addressbook.dto.response.AddressBookResponse;
import com.ssafy.hangbokdog.vaccination.dto.LocationInfo;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerEventRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class AddressBookJpaRepositoryCustomImpl implements AddressBookJpaRepositoryCustom {

	private final JPAQueryFactory queryFactory;
	private final VolunteerEventRepository volunteerEventRepository;

	@Override
	public List<AddressBookResponse> getAddressBookByCenter(Long centerId) {
		return queryFactory
			.select(Projections.constructor(
				AddressBookResponse.class,
				addressBook.id,
				addressBook.addressName,
				addressBook.address
			))
			.from(addressBook)
			.where(addressBook.centerId.eq(centerId))
			.fetch();
	}

	@Override
	public List<LocationInfo> getLocationInfosIn(List<Long> locationIds) {
		return queryFactory
			.select(Projections.constructor(
				LocationInfo.class,
				addressBook.id,
				addressBook.addressName
			))
			.from(addressBook)
			.where(addressBook.id.in(locationIds))
			.fetch();
	}

	@Override
	public List<Long> findAllVolunteerEventIdsByCenterId(Long centerId) {
		return queryFactory.select(
				volunteerEvent.id
		).from(addressBook)
				.innerJoin(volunteerEvent).on(volunteerEvent.addressBookId.eq(addressBook.id))
				.where(addressBook.centerId.eq(centerId))
				.fetch();
	}

	@Override
	public List<Long> findMonthlyVolunteerEventIdsByCenterId(Long centerId) {
		return queryFactory.select(
						volunteerEvent.id
				).from(addressBook)
				.innerJoin(volunteerEvent).on(volunteerEvent.addressBookId.eq(addressBook.id))
				.where(addressBook.centerId.eq(centerId).and(
						volunteerEvent.createdAt.after(LocalDateTime.now().minusMonths(1)))
				)
				.fetch();
	}
}
