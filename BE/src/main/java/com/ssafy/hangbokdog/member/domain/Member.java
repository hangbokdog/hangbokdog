package com.ssafy.hangbokdog.member.domain;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;

    @Column(name = "nick_name", nullable = false, length = 64, unique = true)
    private String nickName;

    @Column(nullable = false, length = 64)
    private String name;

    @Column(nullable = false)
    private LocalDate birth;

    @Column(nullable = false)
    private String phone;

    @Column(name = "age", nullable = false)
    private int age;

    @Column(name = "social_id", nullable = false, length = 32)
    private String socialId;

    @Enumerated(EnumType.STRING)
    private Grade grade;

    @Enumerated(EnumType.STRING)
    private MemberStatus status;

    @Column(name = "description", length = 1024, nullable = false)
    private String description;

    @Column(name = "deleted", nullable = false)
    private boolean deleted;

    @Column(name = "dark_mode_check", nullable = false)
    private boolean darkModeCheck;

    @Column(name = "emergency_notification_check", nullable = false)
    private boolean emergencyNotificationCheck;

    @Column(name = "fcm_token")
    private String fcmToken;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "profile_image", nullable = false)
    private String profileImage;

    public boolean isAdmin() {
        return grade == Grade.ADMIN;
    }

    public boolean isManager() {
        return grade == Grade.MANAGER;
    }
}
