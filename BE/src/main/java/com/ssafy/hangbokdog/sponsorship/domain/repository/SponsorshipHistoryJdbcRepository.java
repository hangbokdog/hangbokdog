package com.ssafy.hangbokdog.sponsorship.domain.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.sponsorship.domain.SponsorshipHistory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SponsorshipHistoryJdbcRepository {

	private final JdbcTemplate jdbcTemplate;

	public void batchInsert(List<SponsorshipHistory> sponsorshipHistories) {
		String sql = "INSERT INTO sponsorship_history (sponsorship_id, amount, status, created_at, modified_at) "
			+ "VALUES (?, ?, ?, NOW(), NOW())";
		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement ps, int i) throws SQLException {
				SponsorshipHistory sponsorshipHistory = sponsorshipHistories.get(i);
				ps.setLong(1, sponsorshipHistory.getSponsorshipId());
				ps.setInt(2, sponsorshipHistory.getAmount());
				ps.setString(3, sponsorshipHistory.getStatus().toString());
			}

			@Override
			public int getBatchSize() {
				return sponsorshipHistories.size();
			}
		});
	}
}
