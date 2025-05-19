package com.ssafy.hangbokdog.post.comment.domain.repository;

import static com.ssafy.hangbokdog.member.domain.QMember.member;
import static com.ssafy.hangbokdog.post.comment.domain.QComment.comment;
import static com.ssafy.hangbokdog.post.post.domain.QPost.*;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.hangbokdog.member.dto.response.MemberInfo;
import com.ssafy.hangbokdog.post.comment.dto.CommentCountInfo;
import com.ssafy.hangbokdog.post.comment.dto.CommentInfo;
import com.ssafy.hangbokdog.post.comment.dto.CommentLikeInfo;
import com.ssafy.hangbokdog.post.comment.dto.response.CommentResponse;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CommentQueryRepositoryImpl implements CommentQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<CommentInfo> findAllByPostId(Long postId, Long loginId) {
        return queryFactory
                .select(Projections.constructor(
                        CommentInfo.class,
                        Projections.constructor(
                                MemberInfo.class,
                                member.id,
                                member.nickName,
                                member.grade.stringValue(),
                                member.profileImage
                        ),
                        comment.authorId.eq(loginId),
                        comment.id,
                        comment.parentId,
                        comment.content,
                        comment.isDeleted,
                        comment.createdAt
                ))
                .from(comment)
                .leftJoin(member).on(member.id.eq(comment.authorId))
                .where(comment.postId.eq(postId))
                .orderBy(comment.createdAt.asc())
                .fetch();
    }

    @Override
    public CommentResponse findByCommentId(Long commentId, Long loginId) {
        return queryFactory
                .select(Projections.constructor(
                        CommentResponse.class,
                        Projections.constructor(
                                MemberInfo.class,
                                member.id,
                                member.nickName,
                                member.grade.stringValue(),
                                member.profileImage
                        ),
                        comment.authorId.eq(loginId),
                        comment.id,
                        comment.parentId,
                        comment.content,
                        comment.isDeleted,
                        comment.createdAt
                ))
                .from(comment)
                .leftJoin(member).on(member.id.eq(comment.authorId))
                .where(comment.id.eq(commentId))
                .fetchOne();
    }

    @Override
    public List<CommentCountInfo> findCommentCountIn(List<Long> postIds) {
        return queryFactory
            .select(Projections.constructor(
                CommentCountInfo.class,
                comment.postId,
                comment.id.count().intValue()
            ))
            .from(comment)
            .where(comment.postId.in(postIds))
            .groupBy(comment.postId)
            .fetch();
    }
}
