package com.ssafy.hangbokdog.post.post.domain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.foster.dto.FosterDiaryCheckQuery;
import com.ssafy.hangbokdog.foster.dto.StartedFosterInfo;
import com.ssafy.hangbokdog.post.post.dto.PostSummaryInfo;
import com.ssafy.hangbokdog.post.post.dto.response.PostResponse;

public interface PostQueryRepository {
    List<PostSummaryInfo> findAll(Long postTypeId, Long centerId, String pageToken, int pageSize);

    List<FosterDiaryCheckQuery> findFostersWithInsufficientDiaries(
        List<StartedFosterInfo> infos,
        LocalDateTime startDate,
        LocalDateTime endDate
    );

    Optional<PostResponse> findByPostId(Long postId);

    List<PostSummaryInfo> getLatestPosts(Long centerId);

    List<PostSummaryInfo> findMyPosts(Long centerId, Long memberId);

    List<PostSummaryInfo> findMyLikedPosts(Long memberId, Long centerId);

    List<PostSummaryInfo> getDogPosts(Long dogId, String pageToken, int pageSize);
}
