package com.ssafy.hangbokdog.post.post.application;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.hangbokdog.center.center.domain.CenterMember;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterMemberRepository;
import com.ssafy.hangbokdog.center.center.domain.repository.CenterRepository;
import com.ssafy.hangbokdog.common.exception.BadRequestException;
import com.ssafy.hangbokdog.common.exception.ErrorCode;
import com.ssafy.hangbokdog.common.model.PageInfo;
import com.ssafy.hangbokdog.member.domain.Member;
import com.ssafy.hangbokdog.post.comment.domain.repository.CommentRepository;
import com.ssafy.hangbokdog.post.comment.dto.CommentCountInfo;
import com.ssafy.hangbokdog.post.post.domain.Post;
import com.ssafy.hangbokdog.post.post.domain.repository.PostRepository;
import com.ssafy.hangbokdog.post.post.dto.PostLikeCount;
import com.ssafy.hangbokdog.post.post.dto.PostSummaryInfo;
import com.ssafy.hangbokdog.post.post.dto.request.PostCreateRequest;
import com.ssafy.hangbokdog.post.post.dto.request.PostUpdateRequest;
import com.ssafy.hangbokdog.post.post.dto.response.PostDetailResponse;
import com.ssafy.hangbokdog.post.post.dto.response.PostResponse;
import com.ssafy.hangbokdog.post.post.dto.response.PostSummaryResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CenterMemberRepository centerMemberRepository;
    private final CommentRepository commentRepository;

    public Long create(
            Member member,
            Long centerId,
            PostCreateRequest request,
            List<String> imageUrls
    ) {
        CenterMember centerMember = centerMemberRepository.findByMemberIdAndCenterId(member.getId(), centerId)
            .orElseThrow(() -> new BadRequestException(ErrorCode.CENTER_MEMBER_NOT_FOUND));

        Post newPost = Post.builder()
                .centerId(centerId)
                .dogId(request.dogId())
                .authorId(member.getId())
                .boardTypeId(request.boardTypeId())
                .title(request.title())
                .content(request.content())
                .imageUrls(imageUrls)
                .build();

        Post post = postRepository.save(newPost);

        return newPost.getId();
    }

    public PageInfo<PostSummaryResponse> findAll(
            Long memberId,
            Long postTypeId,
            Long centerId,
            String pageToken
    ) {
        PageInfo<PostSummaryInfo> infos = postRepository.findAll(postTypeId, centerId, pageToken);
        var data = infos.data();

        List<Long> postIds = data.stream()
                .map(PostSummaryInfo::postId)
                .collect(Collectors.toList());

        Map<Long, Integer> postCommentCounts = commentRepository.findCommentCountIn(postIds)
            .stream()
            .collect(Collectors.toMap(
                CommentCountInfo::postId,
                CommentCountInfo::count
            ));

        Map<Long, Integer> postLikeCounts = postRepository.findPostLikeCountIn(postIds)
            .stream()
                .collect(Collectors.toMap(
                        PostLikeCount::postId,
                        PostLikeCount::likeCount
                ));

        List<Long> likedPosts = postRepository.findLikedPostIdsByMemberId(memberId, postIds);
        Set<Long> likedPostIds = new HashSet<>(likedPosts);

        List<PostSummaryResponse> responses = new ArrayList<>();
        for (PostSummaryInfo info : data) {
            Integer likeCount = postLikeCounts.getOrDefault(info.postId(), 0);
            Boolean liked = likedPostIds.contains(info.postId());
            Integer commentCount = postCommentCounts.getOrDefault(info.postId(), 0);

            PostSummaryResponse response = new PostSummaryResponse(
                    info.memberId(),
                    info.memberNickName(),
                    info.memberImage(),
                    info.postId(),
                    info.title(),
                    info.createdAt(),
                    liked,
                    likeCount,
                    commentCount
            );
            responses.add(response);
        }

        return new PageInfo<>(infos.pageToken(), responses, infos.hasNext());
    }

    public PostDetailResponse findByPostId(Long memberId, Long postId) {
        PostResponse info = postRepository.findByPostId(postId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.POST_NOT_FOUND));

        List<Long> postIds = new ArrayList<>();
        postIds.add(postId);

        Map<Long, Integer> postLikeCounts = postRepository.findPostLikeCountIn(postIds).stream()
                .collect(Collectors.toMap(
                        PostLikeCount::postId,
                        PostLikeCount::likeCount
                ));


        List<Long> likedPosts = postRepository.findLikedPostIdsByMemberId(memberId, postIds);
        Set<Long> likedPostId = new HashSet<>(likedPosts);

        Boolean liked = likedPostId.contains(postId);
        Integer likeCount = postLikeCounts.getOrDefault(postId, 0);

		return new PostDetailResponse(
				info.author(),
				info.postType(),
				info.postId(),
				info.dogId(),
				info.title(),
				info.content(),
				info.images(),
				info.createdAt(),
				liked,
				likeCount
		);
    }

    @Transactional
    public void update(
            Member member,
            Long postId,
            PostUpdateRequest request,
            List<String> imageUrls
    ) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.POST_NOT_FOUND));

        if (!post.isAuthor(member)) {
            throw new BadRequestException(ErrorCode.NOT_AUTHOR);
        }

        post.update(
                request.dogId(),
                request.title(),
                request.content(),
                imageUrls
        );
    }

    @Transactional
    public void delete(Member member, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new BadRequestException(ErrorCode.POST_NOT_FOUND));

        if (!post.isAuthor(member)) {
            throw new BadRequestException(ErrorCode.NOT_AUTHOR);
        }

        postRepository.delete(post);
    }

    public List<PostSummaryResponse> getLatest(Long memberId, Long centerId) {
        List<PostSummaryInfo> infos = postRepository.getLatestPosts(centerId);

        List<Long> postIds = infos.stream()
                .map(PostSummaryInfo::postId)
                .collect(Collectors.toList());

        Map<Long, Integer> postLikeCounts = postRepository.findPostLikeCountIn(postIds).stream()
                .collect(Collectors.toMap(
                        PostLikeCount::postId,
                        PostLikeCount::likeCount
                ));

        Map<Long, Integer> postCommentCounts = commentRepository.findCommentCountIn(postIds)
            .stream()
            .collect(Collectors.toMap(
                CommentCountInfo::postId,
                CommentCountInfo::count
            ));

        List<Long> likedPosts = postRepository.findLikedPostIdsByMemberId(memberId, postIds);
        Set<Long> likedPostIds = new HashSet<>(likedPosts);

        List<PostSummaryResponse> responses = new ArrayList<>();
        for (PostSummaryInfo info : infos) {
            Integer likeCount = postLikeCounts.getOrDefault(info.postId(), 0);
            Boolean liked = likedPostIds.contains(info.postId());
            Integer commentCount = postCommentCounts.getOrDefault(info.postId(), 0);

            PostSummaryResponse response = new PostSummaryResponse(
                    info.memberId(),
                    info.memberNickName(),
                    info.memberImage(),
                    info.postId(),
                    info.title(),
                    info.createdAt(),
                    liked,
                    likeCount,
                    commentCount
            );
            responses.add(response);
        }

        return responses;
    }

    public List<PostSummaryResponse> getMyPosts(Long memberId, Long centerId) {
        List<PostSummaryInfo> infos = postRepository.findMyPosts(centerId, memberId);

        List<Long> postIds = infos.stream()
            .map(PostSummaryInfo::postId)
            .collect(Collectors.toList());

        Map<Long, Integer> postLikeCounts = postRepository.findPostLikeCountIn(postIds).stream()
            .collect(Collectors.toMap(
                PostLikeCount::postId,
                PostLikeCount::likeCount
            ));

        Map<Long, Integer> postCommentCounts = commentRepository.findCommentCountIn(postIds)
            .stream()
            .collect(Collectors.toMap(
                CommentCountInfo::postId,
                CommentCountInfo::count
            ));

        List<Long> likedPosts = postRepository.findLikedPostIdsByMemberId(memberId, postIds);
        Set<Long> likedPostIds = new HashSet<>(likedPosts);

        List<PostSummaryResponse> responses = new ArrayList<>();
        for (PostSummaryInfo info : infos) {
            Integer likeCount = postLikeCounts.getOrDefault(info.postId(), 0);
            Boolean liked = likedPostIds.contains(info.postId());
            Integer commentCount = postCommentCounts.getOrDefault(info.postId(), 0);

            PostSummaryResponse response = new PostSummaryResponse(
                info.memberId(),
                info.memberNickName(),
                info.memberImage(),
                info.postId(),
                info.title(),
                info.createdAt(),
                liked,
                likeCount,
                commentCount
            );
            responses.add(response);
        }

        return responses;
    }

    public List<PostSummaryResponse> getMyLikedPosts(Long memberId, Long centerId) {
        List<PostSummaryInfo> infos = postRepository.findMyLikedPosts(centerId, memberId);

        List<Long> postIds = infos.stream()
            .map(PostSummaryInfo::postId)
            .collect(Collectors.toList());

        Map<Long, Integer> postLikeCounts = postRepository.findPostLikeCountIn(postIds).stream()
            .collect(Collectors.toMap(
                PostLikeCount::postId,
                PostLikeCount::likeCount
            ));

        Map<Long, Integer> postCommentCounts = commentRepository.findCommentCountIn(postIds)
            .stream()
            .collect(Collectors.toMap(
                CommentCountInfo::postId,
                CommentCountInfo::count
            ));

        List<PostSummaryResponse> responses = new ArrayList<>();
        for (PostSummaryInfo info : infos) {
            Integer likeCount = postLikeCounts.getOrDefault(info.postId(), 0);
            Boolean liked = true;
            Integer commentCount = postCommentCounts.getOrDefault(info.postId(), 0);

            PostSummaryResponse response = new PostSummaryResponse(
                info.memberId(),
                info.memberNickName(),
                info.memberImage(),
                info.postId(),
                info.title(),
                info.createdAt(),
                liked,
                likeCount,
                commentCount
            );
            responses.add(response);
        }

        return responses;
    }

    public PageInfo<PostSummaryResponse> getDogPosts(Long memberId, Long dogId, String pageToken) {
        PageInfo<PostSummaryInfo> infos = postRepository.getDogPosts(dogId, pageToken);
        var data = infos.data();

        List<Long> postIds = data.stream()
            .map(PostSummaryInfo::postId)
            .collect(Collectors.toList());

        Map<Long, Integer> postCommentCounts = commentRepository.findCommentCountIn(postIds)
            .stream()
            .collect(Collectors.toMap(
                CommentCountInfo::postId,
                CommentCountInfo::count
            ));

        Map<Long, Integer> postLikeCounts = postRepository.findPostLikeCountIn(postIds)
            .stream()
            .collect(Collectors.toMap(
                PostLikeCount::postId,
                PostLikeCount::likeCount
            ));

        List<Long> likedPosts = postRepository.findLikedPostIdsByMemberId(memberId, postIds);
        Set<Long> likedPostIds = new HashSet<>(likedPosts);

        List<PostSummaryResponse> responses = new ArrayList<>();
        for (PostSummaryInfo info : data) {
            Integer likeCount = postLikeCounts.getOrDefault(info.postId(), 0);
            Boolean liked = likedPostIds.contains(info.postId());
            Integer commentCount = postCommentCounts.getOrDefault(info.postId(), 0);

            PostSummaryResponse response = new PostSummaryResponse(
                info.memberId(),
                info.memberNickName(),
                info.memberImage(),
                info.postId(),
                info.title(),
                info.createdAt(),
                liked,
                likeCount,
                commentCount
            );
            responses.add(response);
        }

        return new PageInfo<>(infos.pageToken(), responses, infos.hasNext());
    }
}
