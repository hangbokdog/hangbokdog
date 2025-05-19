package com.ssafy.hangbokdog.post.post.domain.repository;

import static com.ssafy.hangbokdog.member.domain.QMember.member;
import static com.ssafy.hangbokdog.post.post.domain.QPost.post;
import static com.ssafy.hangbokdog.post.post.domain.QPostLike.*;
import static com.ssafy.hangbokdog.post.post.domain.QPostType.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.foster.dto.FosterDiaryCheckQuery;
import com.ssafy.hangbokdog.foster.dto.StartedFosterInfo;
import com.ssafy.hangbokdog.member.dto.response.MemberInfo;
import com.ssafy.hangbokdog.post.post.dto.PostSummaryInfo;
import com.ssafy.hangbokdog.post.post.dto.response.PostResponse;
import com.ssafy.hangbokdog.post.post.dto.response.PostTypeResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PostQueryRepositoryImpl implements PostQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<PostSummaryInfo> findAll(Long postTypeId, Long centerId, String pageToken, int pageSize) {
        return queryFactory
                .select(Projections.constructor(
                        PostSummaryInfo.class,
                        post.authorId,
                        member.nickName,
                        member.profileImage,
                        post.id,
                        post.title,
                        post.createdAt,
                        post.postTypeId,
                        postType.name
                ))
                .from(post)
                .leftJoin(member).on(member.id.eq(post.authorId))
                .leftJoin(postType).on(post.postTypeId.eq(postType.id))
                .where(isInRange(pageToken),
                        post.centerId.eq(centerId),
                        post.postTypeId.eq(postTypeId))
                .orderBy(post.id.desc())
                .limit(pageSize + 1)
                .fetch();
    }

    @Override
    public Optional<PostResponse> findByPostId(Long postId) {
        PostResponse dto = queryFactory
                .select(Projections.constructor(
                        PostResponse.class,
                        Projections.constructor(
                                MemberInfo.class,
                                member.id,
                                member.nickName,
                                member.grade.stringValue(),
                                member.profileImage
                        ),
                        Projections.constructor(
                                PostTypeResponse.class,
                                postType.id,
                                postType.name
                        ),
                        post.id,
                        post.dogId,
                        post.title,
                        post.content,
                        post.imageUrls,
                        post.createdAt
                ))
                .from(post)
                .leftJoin(member).on(member.id.eq(post.authorId))
                .leftJoin(postType).on(postType.id.eq(post.postTypeId))
                .where(post.id.eq(postId))
                .fetchOne();

        return Optional.ofNullable(dto);
    }

    @Override
    public List<PostSummaryInfo> getLatestPosts(Long centerId) {
        return queryFactory
                .select(Projections.constructor(
                        PostSummaryInfo.class,
                        member.id,
                        member.nickName,
                        member.profileImage,
                        post.id,
                        post.title,
                        post.createdAt,
                        post.postTypeId,
                        postType.name
                ))
                .from(post)
                .leftJoin(member).on(member.id.eq(post.authorId))
                .leftJoin(postType).on(post.postTypeId.eq(postType.id))
                .where(post.centerId.eq(centerId))
                .orderBy(post.id.desc())
                .limit(5)
                .fetch();
    }

    @Override
    public List<PostSummaryInfo> findMyPosts(Long centerId, Long memberId) {
        return queryFactory
            .select(Projections.constructor(
                PostSummaryInfo.class,
                post.authorId,
                member.nickName,
                member.profileImage,
                post.id,
                post.title,
                post.createdAt,
                post.postTypeId,
                postType.name
            ))
            .from(post)
            .join(member).on(post.authorId.eq(member.id))
            .join(postType).on(post.postTypeId.eq(postType.id))
            .where(post.centerId.eq(centerId),
                post.authorId.eq(memberId))
            .orderBy(post.createdAt.desc())
            .fetch();
    }

    @Override
    public List<PostSummaryInfo> findMyLikedPosts(Long memberId, Long centerId) {
        return queryFactory
            .select(Projections.constructor(
                PostSummaryInfo.class,
                post.authorId,
                member.nickName,
                member.profileImage,
                post.id,
                post.title,
                post.createdAt,
                post.postTypeId,
                postType.name
            ))
            .from(post)
            .join(member).on(post.authorId.eq(member.id))
            .join(postType).on(post.postTypeId.eq(postType.id))
            .join(postLike).on(postLike.postId.eq(post.id))
            .where(
                post.centerId.eq(centerId),
                postLike.memberId.eq(memberId)
            )
            .orderBy(post.createdAt.desc())
            .fetch();
    }

    @Override
    public List<PostSummaryInfo> getDogPosts(Long dogId, String pageToken, int pageSize) {
        return queryFactory
            .select(Projections.constructor(
                PostSummaryInfo.class,
                post.authorId,
                member.nickName,
                member.profileImage,
                post.id,
                post.title,
                post.createdAt,
                post.postTypeId,
                postType.name
            ))
            .from(post)
            .join(member).on(post.authorId.eq(member.id))
            .join(postType).on(post.postTypeId.eq(postType.id))
            .where(post.dogId.eq(dogId),
                isInRange(pageToken))
            .orderBy(post.createdAt.desc())
            .limit(pageSize + 1)
            .fetch();
    }

    @Override
    public List<FosterDiaryCheckQuery> findFostersWithInsufficientDiaries(
        List<StartedFosterInfo> infos,
        LocalDateTime startDate,
        LocalDateTime endDate
    ) {
        Set<String> pairKeys = infos.stream()
            .map(info -> info.memberId() + "|" + info.dogId())
            .collect(Collectors.toSet());

        return queryFactory
            .select(
                Projections.constructor(
                    FosterDiaryCheckQuery.class,
                    post.authorId,
                    post.dogId,
                    post.count().intValue()
                )
            )
            .from(post)
            .join(postType).on(post.postTypeId.eq(postType.id))
            .where(
                Expressions.stringTemplate("CONCAT({0}, '|', {1})", post.authorId, post.dogId).in(pairKeys),
                post.createdAt.between(startDate, endDate),
                postType.name.eq("임시보호")
            )
            .groupBy(post.authorId, post.dogId)
            .fetch();
    }

    private BooleanExpression isInRange(String pageToken) {
        if (pageToken == null) {
            return null;
        }

        return post.id.lt(Long.valueOf(pageToken));
    }
}
