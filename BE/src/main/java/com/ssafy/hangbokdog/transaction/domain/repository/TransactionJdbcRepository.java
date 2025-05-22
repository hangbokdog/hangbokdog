package com.ssafy.hangbokdog.transaction.domain.repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ssafy.hangbokdog.transaction.domain.Transaction;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class TransactionJdbcRepository {

	private final JdbcTemplate jdbcTemplate;

	public void batchInsert(List<Transaction> transactions) {
		String sql = "INSERT INTO transaction (member_id, type, amount, created_at, modified_at) "
			+ "VALUES (?, ?, ?, NOW(), NOW())";
		jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {

			@Override
			public void setValues(PreparedStatement ps, int idx) throws SQLException {
				Transaction transaction = transactions.get(idx);
				ps.setLong(1, transaction.getMemberId());
				ps.setString(2, transaction.getType().toString());
				ps.setInt(3, transaction.getAmount());
			}

			@Override
			public int getBatchSize() {
				return transactions.size();
			}
		});
	}
}
