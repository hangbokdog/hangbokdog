package com.ssafy.hangbokdog.center.center.application;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.hangbokdog.adoption.domain.repository.AdoptionRepository;
import com.ssafy.hangbokdog.center.addressbook.domain.repository.AddressBookRepository;
import com.ssafy.hangbokdog.center.center.domain.Center;
import com.ssafy.hangbokdog.center.center.domain.CenterJoinRequest;
import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterCity;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterGrade;
import com.ssafy.hangbokdog.center.center.domain.enums.CenterStatus;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterJoinRequestRepository;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.center.center.dto.CenterSearchInfo;
import com.ssafy.hangbokdog.center.center.dto.request.CenterCreateRequest;
import com.ssafy.hangbokdog.center.center.dto.response.AppliedCenterResponse;
import com.ssafy.hangbokdog.center.center.dto.response.CenterInformationResponse;
import com.ssafy.hangbokdog.center.center.dto.response.CenterJoinRequestResponse;
import com.ssafy.hangbokdog.center.center.dto.response.CenterJoinResponse;
import com.ssafy.hangbokdog.center.center.dto.response.CenterSearchResponse;
import com.ssafy.hangbokdog.center.center.dto.response.CenterStatisticResponse;
import com.ssafy.hangbokdog.center.center.dto.response.ExistingCityResponse;
import com.ssafy.hangbokdog.center.center.dto.response.MainCenterResponse;
import com.ssafy.hangbokdog.center.center.dto.response.MyCenterResponse;
import com.ssafy.hangbokdog.center.donationaccount.domain.DonationAccount;
import com.ssafy.hangbokdog.center.donationaccount.domain.repository.DonationAccountRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.dog.dog.domain.repository.DogRepository;
import com.ssafy.hangbokdog.donation.domain.repository.DonationHistoryRepository;
import com.ssafy.hangbokdog.fcm.domain.NotificationType;
import com.ssafy.hangbokdog.fcm.dto.event.CenterMemberEvent;
import com.ssafy.hangbokdog.foster.domain.repository.FosterRepository;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.notification.domain.Notification;
import com.ssafy.hangbokdog.notification.domain.repository.NotificationRepository;
import com.ssafy.hangbokdog.volunteer.application.domain.repository.VolunteerApplicationRepository;
import com.ssafy.hangbokdog.volunteer.event.domain.repository.VolunteerEventRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CenterService {

	private static final String CENTER_REDIS_KEY_PREFIX = "center:";
	private static final String APPROVE_COMMENT = "센터 가입 승인되었습니다.";
	private static final String REFUSE_COMMENT = "센터 가입 거절되었습니다.";

	private final RedisTemplate<String, Object> redisTemplate;
	private final ObjectMapper objectMapper;

	private final CenterRepository centerRepository;
	private final CenterMemberRepository centerMemberRepository;
	private final CenterJoinRequestRepository centerJoinRequestRepository;
	private final DonationAccountRepository donationAccountRepository;
	private final ApplicationEventPublisher eventPublisher;
	private final DogRepository dogRepository;
	private final FosterRepository fosterRepository;
	private final AdoptionRepository adoptionRepository;
	private final DonationHistoryRepository donationHistoryRepository;
	private final NotificationRepository notificationRepository;
	private final VolunteerEventRepository volunteerEventRepository;
	private final AddressBookRepository addressBookRepository;
	private final VolunteerApplicationRepository volunteerApplicationRepository;

	@Transactional
	public Long createCenter(Member member, CenterCreateRequest request) {

		Center center = Center.builder()
			.name(request.name())
			.centerCity(request.centerCity())
			.sponsorAmount(request.sponsorAmount())
			.build();

		Long centerId = centerRepository.create(center).getId();

		CenterMember centerMember = CenterMember.builder()
				.centerId(centerId)
				.memberId(member.getId())
				.build();

		centerMember.promote();
		centerMemberRepository.save(centerMember);

		donationAccountRepository.createDonationAccount(DonationAccount.createDonationAccount(
			centerId,
			0L
		));

		return centerId;
	}

	public CenterJoinResponse join(Member member, Long centerId) {
		if (!centerRepository.existsById(centerId)) {
			throw new BadRequestException(ErrorCode.CENTER_NOT_FOUND);
		}

		if (centerMemberRepository.existsByMemberIdAndCenterId(member.getId(), centerId)) {
			throw new BadRequestException(ErrorCode.ALREADY_JOIN_CENTER);
		}

		if (centerJoinRequestRepository.existsByMemberIdAndCenterId(member.getId(), centerId)) {
			throw new BadRequestException(ErrorCode.ALREADY_CENTER_JOIN_REQUEST);
		}

		Long id = centerJoinRequestRepository.save(
				CenterJoinRequest.builder()
						.centerId(centerId)
						.memberId(member.getId())
						.build()
		).getId();

		return new CenterJoinResponse(id);
	}

	@Transactional
	public void approve(Member member, Long centerJoinRequestId) {
		var centerJoinRequest = centerJoinRequestRepository.findById(centerJoinRequestId)
				.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_JOIN_REQUEST_NOT_FOUND));

		Long centerId = centerJoinRequest.getCenterId();
		var centerMember = getCenterMember(member.getId(), centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		centerMemberRepository.save(
				CenterMember.builder()
						.centerId(centerId)
						.memberId(centerJoinRequest.getMemberId())
						.build()
		);

		centerJoinRequestRepository.deleteById(centerJoinRequest.getId());

		String centerName = centerRepository.findNameById(centerId);

		Notification notification = Notification.builder()
				.type(NotificationType.CENTER)
				.receiverId(centerJoinRequest.getMemberId())
				.targetId(centerJoinRequest.getCenterId())
				.title(centerName)
				.content(APPROVE_COMMENT)
				.build();

		notificationRepository.insert(notification);

		eventPublisher.publishEvent(new CenterMemberEvent(
				centerName,
				centerJoinRequest.getMemberId(),
				true
		));
	}

	public void reject(Member member, Long centerJoinRequestId) {
		var centerJoinRequest = centerJoinRequestRepository.findById(centerJoinRequestId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_JOIN_REQUEST_NOT_FOUND));

		Long centerId = centerJoinRequest.getCenterId();
		var centerMember = getCenterMember(member.getId(), centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		centerJoinRequestRepository.deleteById(centerJoinRequest.getId());

		String centerName = centerRepository.findNameById(centerId);

		Notification notification = Notification.builder()
				.type(NotificationType.CENTER)
				.receiverId(centerJoinRequest.getMemberId())
				.targetId(centerJoinRequest.getCenterId())
				.title(centerName)
				.content(REFUSE_COMMENT)
				.build();

		notificationRepository.insert(notification);

		eventPublisher.publishEvent(new CenterMemberEvent(
				centerName,
				centerJoinRequest.getMemberId(),
				false
		));
	}

	public PageInfo<CenterJoinRequestResponse> findAll(Member member, Long centerId, String pageToken) {
		var centerMember = getCenterMember(member.getId(), centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		return centerJoinRequestRepository.findAll(centerId, pageToken);
	}

	public List<MyCenterResponse> getMyCenters(Long memberId) {
		return centerMemberRepository.getMyCenters(memberId);
	}

	public List<CenterSearchResponse> searchCenters(Long memberId, String name, CenterCity centerCity) {
		List<CenterSearchInfo> searchInfos = centerRepository.findCentersByName(name, centerCity);
		List<CenterMember> centerMemberList = centerMemberRepository.getCenterMembersByMemberId(memberId);
		List<CenterJoinRequest> centerJoinRequests = centerJoinRequestRepository
				.getCenterJoinRequestsByMemberId(memberId);
		List<CenterSearchResponse> searchResponses = new ArrayList<>();

		Map<Long, CenterGrade> centerGrade = centerMemberList.stream()
				.collect(Collectors.toMap(
						CenterMember::getCenterId,
						CenterMember::getGrade
				));

		Map<Long, Long> centerJoinRequestIds = centerJoinRequests.stream()
				.collect(Collectors.toMap(
						CenterJoinRequest::getCenterId,
						CenterJoinRequest::getId
				));

		for (CenterSearchInfo searchInfo : searchInfos) {
			CenterStatus status = CenterStatus.NONE;
			Long centerJoinRequestId = null;

			if (centerGrade.containsKey(searchInfo.id())) {
				CenterGrade grade = centerGrade.get(searchInfo.id());

				if (grade.equals(CenterGrade.USER)) {
					status = CenterStatus.MEMBER;
				} else {
					status = CenterStatus.MANAGER;
				}
			}

			if (centerJoinRequestIds.containsKey(searchInfo.id())) {
				centerJoinRequestId = centerJoinRequestIds.get(searchInfo.id());
				status = CenterStatus.APPLIED;
			}

			CenterSearchResponse response = new CenterSearchResponse(
					centerJoinRequestId,
					searchInfo.id(),
					searchInfo.name(),
					searchInfo.centerCity(),
					status
			);

			searchResponses.add(response);
		}
		return searchResponses;
	}

	public List<ExistingCityResponse> getExistingCity() {
		return centerRepository.getExistingCities();
	}

	public List<AppliedCenterResponse> getAppliedCenters(Long memberId) {
		return centerJoinRequestRepository.getAppliedCentersByMemberId(memberId);
	}

	public void deleteCenterJoinRequest(Long memberId, Long centerJoinRequestId) {
		CenterJoinRequest centerJoinRequest = centerJoinRequestRepository.findById(centerJoinRequestId)
				.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_JOIN_REQUEST_NOT_FOUND));

		if (!centerJoinRequest.isAuthor(memberId)) {
			throw new BadRequestException(ErrorCode.NOT_AUTHOR);
		}

		centerJoinRequestRepository.deleteById(centerJoinRequest.getId());
	}

	public void deleteCenterMember(Long memberId, Long centerId) {
		CenterMember centerMember = getCenterMember(memberId, centerId);

		if (!centerMember.isSelf(memberId) && !centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_CENTER_MEMBER_HIMSELF);
		}

		centerMemberRepository.delete(centerMember);
	}

	@Transactional
	public void registerMainCenter(Long memberId, Long centerId) {
		CenterMember centerMember = getCenterMember(memberId, centerId);

		if (centerMember.isMain()) {
			throw new BadRequestException(ErrorCode.CENTER_ALREADY_MAIN);
		}

		CenterMember mainCenter = centerMemberRepository.getMainCenterByMemberId(memberId);

		if (mainCenter != null) {
			mainCenter.cancelMain();
		}

		centerMember.makeMain();
	}

	public void cancelMainCenter(Long memberId, Long centerId) {
		CenterMember centerMember = getCenterMember(memberId, centerId);

		if (!centerMember.isMain()) {
			throw new BadRequestException(ErrorCode.NOT_MAIN_CENTER);
		}

		centerMember.cancelMain();
	}

	public MainCenterResponse getMainCenter(Long memberId) {
		return centerMemberRepository.getMainCenter(memberId);
	}

	public CenterInformationResponse getCenterInformation(Long memberId, Long centerId) {
		CenterMember centerMember = getCenterMember(memberId, centerId);

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		String key = CENTER_REDIS_KEY_PREFIX + centerId + ":information";

		Object cached = redisTemplate.opsForValue().get(key);
		if (cached != null) {
			return objectMapper.convertValue(cached, CenterInformationResponse.class);
		}

		LocalDateTime lastMonthEnd = LocalDate.now()
				.minusMonths(1)
				.withDayOfMonth(LocalDate.now().minusMonths(1).lengthOfMonth())
				.atTime(23, 59, 59);

		LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
		LocalDateTime monthEnd = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()).atTime(23, 59, 59);

		Integer totalDogCount = dogRepository.getDogCount(centerId);
		Integer lastMonthDogCount = dogRepository.getLastMonthDogCount(centerId, lastMonthEnd);
		Integer fosterCount = fosterRepository.getFosterCount(centerId);
		Integer lastMonthFosterCount = fosterRepository.getLastMonthFosterCount(centerId, lastMonthEnd);
		Integer adoptionCount = adoptionRepository.getAdoptionCount(centerId);
		Long monthlyDonationAmount = donationHistoryRepository.getMonthlyDonationAmountByCenterId(
				centerId,
				monthStart,
				monthEnd
		);
		Integer hospitalCount = dogRepository.getHospitalDogCount(centerId);
		Integer protectedCount = dogRepository.getProtectedDogCount(centerId);
		Long centerMileageAmount = donationAccountRepository.getDonationAccountBalance(centerId);

		CenterInformationResponse response = new CenterInformationResponse(
				totalDogCount,
				lastMonthDogCount,
				fosterCount,
				lastMonthFosterCount,
				adoptionCount,
				monthlyDonationAmount,
				hospitalCount,
				protectedCount,
				centerMileageAmount
		);

		redisTemplate.opsForValue().set(key, response, Duration.ofHours(24));

		return response;
	}

	private CenterMember getCenterMember(Long memberId, Long centerId) {
		return centerMemberRepository.findByMemberIdAndCenterId(memberId, centerId)
			.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));
	}

	public CenterStatisticResponse getStatistic(Member member, Long centerId) {
		var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
				.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		int centerMemberCount = centerMemberRepository.getTotalCenterMemberCount(centerId);
		int newCenterMemberCount = centerMemberRepository.getCenterMemberCountAfterTime(
				centerId,
				LocalDateTime.now().minusMonths(1)
		);

		var volunteerEventIds = addressBookRepository.findAllVolunteerEventIdsByCenterId(centerId);
		int volunteerParticipantCount = volunteerApplicationRepository
				.getTotalCompletedApplicationCountByVolunteerEventIdsIn(volunteerEventIds
		);
		int centerManagerMemberCount = centerMemberRepository.getMemberCountByCenterIdAndGrade(
				centerId,
				CenterGrade.MANAGER
		);
		int centerNormalMemberCount = centerMemberCount - centerManagerMemberCount;
		return CenterStatisticResponse.of(
				centerMemberCount,
				newCenterMemberCount,
				volunteerParticipantCount,
				centerManagerMemberCount,
				centerNormalMemberCount
		);
	}

	@Transactional
	public void promote(Member member, Long memberId, Long centerId) {
		var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
				.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		var targetCenterMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
				.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (targetCenterMember.isManager()) {
			throw new BadRequestException(ErrorCode.ALREADY_MANAGER_MEMBER);
		}

		targetCenterMember.promote();
	}

	@Transactional
	public void kickOut(Member member, Long memberId, Long centerId) {
		var centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
				.orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

		if (!centerMember.isManager()) {
			throw new BadRequestException(ErrorCode.NOT_MANAGER_MEMBER);
		}

		centerMemberRepository.deleteByMemberIdAndCenterId(memberId, centerId);
	}
}
