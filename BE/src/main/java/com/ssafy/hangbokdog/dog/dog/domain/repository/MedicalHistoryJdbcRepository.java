package com.ssafy.hangbokdog.dog.dog.domain.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.dog.dog.domain.enums.MedicalType;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MedicalHistoryJdbcRepository {

	private final JdbcTemplate jdbcTemplate;

	public void bulkInsertMedicalHistory(
		List<Long> dogIds,
		String content,
		LocalDateTime operatedTime
	) {
		String sql = "INSERT INTO medical_history"
			+ "(dog_id, content, medical_history_image, "
			+ "medical_period, medical_type, operated_time, created_at, modified_at)"
			+ " VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";

		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
			@Override
			public void setValues(PreparedStatement ps, int idx) throws SQLException {
				Long dogId = dogIds.get(idx);
				ps.setLong(1, dogId);
				ps.setString(2, content);
				ps.setString(3, null);
				ps.setString(4, null);
				ps.setString(5, MedicalType.MEDICATION.toString());
				ps.setTimestamp(6, Timestamp.valueOf(operatedTime));

			}

			@Override
			public int getBatchSize() {
				return dogIds.size();
			}
		});
	}
}
