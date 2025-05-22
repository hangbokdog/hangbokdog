package com.ssafy.hangbokdog.donation.domain.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.donation.domain.DonationHistory;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class DonationHistoryJdbcRepository {
	private final JdbcTemplate jdbcTemplate;
	public void batchInsert(List<DonationHistory> donationHistories) {
		String sql = "INSERT INTO donation_history (donor_id, amount, type, created_at, modified_at)"
			+ " VALUES (?, ?, ?, NOW(), NOW())";
		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement ps, int idx) throws SQLException {
				DonationHistory donationHistory = donationHistories.get(idx);
				ps.setLong(1, donationHistory.getDonorId());
				ps.setInt(2, donationHistory.getAmount());
				ps.setString(3, donationHistory.getType().name());
			}

			@Override
			public int getBatchSize() {
				return donationHistories.size();
			}
		});
	}
}
