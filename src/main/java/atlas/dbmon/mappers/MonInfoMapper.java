package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.MonInfo;

public class MonInfoMapper implements RowMapper<MonInfo> {

	@Override
	public MonInfo mapRow(ResultSet rs, int rownum) throws SQLException {
		MonInfo nt = new MonInfo();
		nt.setInstId(rs.getLong("inst_id"));
		nt.setParsingSchemaName(rs.getString("parsing_schema_name"));
		nt.setFetches(rs.getLong("fetches"));
		nt.setExecutions(rs.getLong("executions"));
		nt.setFirstLoadTime(rs.getString("first_load_time"));
		nt.setParseCalls(rs.getLong("parse_calls"));
		nt.setDiskReads(rs.getLong("disk_reads"));
		nt.setDirectWrites(rs.getLong("direct_writes"));
		nt.setBufferGets(rs.getLong("buffer_gets"));
		nt.setParseCalls(rs.getLong("parse_calls"));
		nt.setApplicationWaitTime(rs.getLong("application_wait_time"));
		nt.setConcurrencyWaitTime(rs.getLong("concurrency_wait_time"));
		nt.setClusterWaitTime(rs.getLong("cluster_wait_time"));
		nt.setCpuTime(rs.getFloat("cpu_time"));
		nt.setUserIoWaitTime(rs.getFloat("user_io_wait_time"));
		nt.setElapsedTime(rs.getFloat("elapsed_time"));
		nt.setService(rs.getString("service"));
		nt.setModule(rs.getString("module"));
		nt.setOptimizerMode(rs.getString("optimizer_mode"));
		nt.setOptimizerCost(rs.getLong("optimizer_cost"));
		nt.setRowsProcessed(rs.getLong("rows_processed"));
		return nt;
	}

}
