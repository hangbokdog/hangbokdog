package com.ssafy.hangbokdog.vaccination.application;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.addressbook.domain.repository.AddressBookRepository;
import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.dog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.vaccination.domain.Vaccination;
import com.ssafy.hangbokdog.vaccination.domain.enums.VaccinationStatus;
import com.ssafy.hangbokdog.vaccination.domain.repository.VaccinationRepository;
import com.ssafy.hangbokdog.vaccination.dto.LocationInfo;
import com.ssafy.hangbokdog.vaccination.dto.VaccinationDetailInfo;
import com.ssafy.hangbokdog.vaccination.dto.VaccinationSummaryInfo;
import com.ssafy.hangbokdog.vaccination.dto.request.VaccinationCompleteRequest;
import com.ssafy.hangbokdog.vaccination.dto.request.VaccinationCreateRequest;
import com.ssafy.hangbokdog.vaccination.dto.response.VaccinationCreateResponse;
import com.ssafy.hangbokdog.vaccination.dto.response.VaccinationDetailResponse;
import com.ssafy.hangbokdog.vaccination.dto.response.VaccinationDoneResponse;
import com.ssafy.hangbokdog.vaccination.dto.response.VaccinationSummaryResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VaccinationService {

	private final VaccinationRepository vaccinationRepository;
	private final CenterMemberRepository centerMemberRepository;
	private final CenterRepository centerRepository;
	private final DogRepository dogRepository;
	private final AddressBookRepository addressBookRepository;

	public VaccinationCreateResponse createVaccination(Long centerId, Long memberId, VaccinationCreateRequest request) {

		if (centerRepository.existsById(centerId)) {
			throw new BadRequestException(ErrorCode.CENTER_NOT_FOUND);
		}

		CenterMember centerMember = getCenterMember(centerId, memberId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		Vaccination vaccination = Vaccination.builder()
			.centerId(centerId)
			.authorId(memberId)
			.title(request.title())
			.content(request.content())
			.operatedDate(request.operatedDate())
			.locationIds(request.locationIds())
			.status(VaccinationStatus.ONGOING)
			.build();

		Vaccination savedVaccination = vaccinationRepository.save(vaccination);

		return new VaccinationCreateResponse(savedVaccination.getId());
	}

	@Transactional
	public void completeVaccination(
		Long centerId,
		Long memberId,
		Long vaccinationId,
		VaccinationCompleteRequest request
	) {
		CenterMember centerMember = getCenterMember(centerId, memberId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		Vaccination vaccination = getVaccination(vaccinationId);

		vaccinationRepository.bulkInsertVaccinatedDog(request.dogIds(), vaccinationId);

		vaccination.complete();
	}

	public VaccinationDetailResponse getVaccinationDetail(Long vaccinationId) {
		Vaccination vaccination = getVaccination(vaccinationId);

		List<Long> totalDogIds = vaccination.getLocationIds();

		VaccinationDetailInfo vaccinationDetailInfo = vaccinationRepository.getVaccinationDetailInfo(vaccinationId);
		Integer vaccinatedDogCount = vaccinationRepository.countVaccinationByVaccinationId(vaccinationId);
		Integer totalDog = dogRepository.getLocationDogCountIn(totalDogIds);

		return VaccinationDetailResponse.of(vaccinationDetailInfo, totalDog, vaccinatedDogCount);
	}

	@Transactional
	public void saveVaccination(
		Long centerId,
		Long memberId,
		Long vaccinationId,
		VaccinationCompleteRequest request
	) {
		CenterMember centerMember = getCenterMember(centerId, memberId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		Vaccination vaccination = getVaccination(vaccinationId);

		vaccinationRepository.bulkInsertVaccinatedDog(request.dogIds(), vaccinationId);
	}

	public PageInfo<VaccinationSummaryResponse> getVaccinationSummaries(Long centerId, String pageToken) {
		PageInfo<VaccinationSummaryInfo> vaccinationSummaryInfo = vaccinationRepository.getVaccinationSummaryByCenterId(centerId, pageToken);

		var data = vaccinationSummaryInfo.data();

		List<Long> locationIds = data.stream()
			.flatMap(info -> info.locationIds().stream())
			.distinct()
			.toList();


		List<LocationInfo> locationInfos = addressBookRepository.getLocationInfosIn(locationIds);

		Map<Long, String> locations = locationInfos.stream()
			.collect(Collectors.toMap(
				LocationInfo::locationId,
				LocationInfo::locationName
			));

		List<VaccinationSummaryResponse> responses = new ArrayList<>();

		for (VaccinationSummaryInfo info : data) {

			List<LocationInfo> locationInfo = new ArrayList<>();

			for (Long id : info.locationIds()) {
				locationInfo.add(new LocationInfo(id, locations.get(id)));
			}

			VaccinationSummaryResponse response = new VaccinationSummaryResponse(
				info.vaccinationId(),
				info.title(),
				info.content(),
				info.operatedDate(),
				locationInfo
			);

			responses.add(response);
		}

		return new PageInfo<>(vaccinationSummaryInfo.pageToken(), responses, vaccinationSummaryInfo.hasNext());
	}

	public PageInfo<VaccinationDoneResponse> getVaccinatedDogs(Long vaccinationId, String pageToken) {
		return vaccinationRepository.getVaccinationDogsByVaccinationId(vaccinationId, pageToken);
	}

	public PageInfo<VaccinationDoneResponse> getNotVaccinatedDogs(Long vacationId, String pageToken) {
		Vaccination vaccination = getVaccination(vacationId);
		List<Long> dogIds = vaccinationRepository.getVaccinatedDogIdsByVaccinationId(vacationId);
		List<Long> locationIds = vaccination.getLocationIds();
		return dogRepository.getNotVaccinatedDogs(dogIds, locationIds, pageToken);
	}

	private Vaccination getVaccination(Long vaccinationId) {
		return vaccinationRepository.getVaccinationById(vaccinationId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.VACCINATION_NOT_FOUND));
	}

	private CenterMember getCenterMember(Long centerId, Long memberId) {
		return centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));
	}
}
