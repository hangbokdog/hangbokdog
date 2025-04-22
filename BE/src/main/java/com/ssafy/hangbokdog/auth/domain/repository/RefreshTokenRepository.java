package com.ssafy.hangbokdog.auth.domain.repository;

import org.springframework.data.repository.CrudRepository;

import com.ssafy.hangbokdog.auth.domain.RefreshToken;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
}
