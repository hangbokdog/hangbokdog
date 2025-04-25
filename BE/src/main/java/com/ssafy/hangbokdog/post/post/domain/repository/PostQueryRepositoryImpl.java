package com.ssafy.hangbokdog.post.post.domain.repository;

import static com.ssafy.hangbokdog.member.domain.QMember.member;
import static com.ssafy.hangbokdog.post.post.domain.QPost.post;
import static com.ssafy.hangbokdog.post.post.domain.QPostType.*;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.member.dto.response.MemberInfo;
import com.ssafy.hangbokdog.post.post.dto.response.PostResponse;
import com.ssafy.hangbokdog.post.post.dto.response.PostTypeResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PostQueryRepositoryImpl implements PostQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<PostResponse> findAll(String pageToken, int pageSize) {
        return queryFactory
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
                .where(isInRange(pageToken))
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

    private BooleanExpression isInRange(String pageToken) {
        if (pageToken == null) {
            return null;
        }

        return post.id.lt(Long.valueOf(pageToken));
    }
}
