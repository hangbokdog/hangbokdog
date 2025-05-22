package com.ssafy.hangbokdog.dog.dog.domain.repository;

import java.util.List;

import com.ssafy.hangbokdog.dog.dog.dto.FavoriteDogCount;

public interface FavoriteDogJpaRepositoryCustom {
	List<FavoriteDogCount> getFavoriteCountByDogIds(List<Long> dogIds);
}
