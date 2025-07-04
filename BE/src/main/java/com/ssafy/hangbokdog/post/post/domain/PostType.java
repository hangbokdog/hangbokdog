package com.ssafy.hangbokdog.post.post.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import com.ssafy.hangbokdog.common.entity.BaseEntity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostType extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_type_id")
    private Long id;

    @Column(name = "post_type_name", nullable = false, length = 50)
    private String name;

    @Column(name = "center_id", nullable = false)
    private Long centerId;

    public PostType(String name, Long centerId) {
        this.name = name;
        this.centerId = centerId;
    }

    public void update(String newName) {
        this.name = newName;
    }
}