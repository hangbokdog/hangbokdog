package com.ssafy.hangbokdog.vaccination.domain.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class VaccinatedDogJdbcRepository {

	private final JdbcTemplate jdbcTemplate;

	public void bulkInsertVaccinatedDog(List<Long> dogIds, Long vaccinationId) {
		String sql = "INSERT INTO vaccinated_dog (dog_id, vaccination_id, created_at, modified_at) "
			+ "VALUES (?, ?, NOW(), NOW())";
		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement ps, int idx) throws SQLException {
				Long dogId = dogIds.get(idx);
				ps.setLong(1, dogId);
				ps.setLong(2, vaccinationId);
			}

			@Override
			public int getBatchSize() {
				return 0;
			}
		});
	}
}
