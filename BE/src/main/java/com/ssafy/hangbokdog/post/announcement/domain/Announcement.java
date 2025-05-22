package com.ssafy.hangbokdog.post.announcement.domain;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import org.hibernate.annotations.Type;

import com.ssafy.hangbokdog.common.entity.BaseEntity;
import com.ssafy.hangbokdog.member.domain.Member;
import com.vladmihalcea.hibernate.type.json.JsonType;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Announcement extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "announcement_id", nullable = false)
	private Long id;

	@Column(name = "title", nullable = false, length = 256)
	private String title;

	@Column(name = "content", nullable = false, length = 10000)
	private String content;

	@Column(name = "author_id", nullable = false)
	private Long authorId;

	@Column(name = "center_id", nullable = false)
	private Long centerId;

	@Type(JsonType.class)
	@Column(columnDefinition = "json")
	private List<String> imageUrls;

	@Builder
	public Announcement(
		String title,
		String content,
		Long authorId,
		Long centerId,
		List<String> imageUrls
	) {
		this.title = title;
		this.content = content;
		this.authorId = authorId;
		this.centerId = centerId;
		this.imageUrls = imageUrls;
	}

	public boolean isAuthor(Member member) {
		return authorId.equals(member.getId());
	}

	public void update(
		String title,
		String content,
		List<String> imageUrls
	) {
		this.title = title;
		this.content = content;
		this.imageUrls = imageUrls;
	}
}
