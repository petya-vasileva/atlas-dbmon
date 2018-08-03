package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.JobsInfo;

public class JobsInfoMapper implements RowMapper<JobsInfo> {

	@Override
	public JobsInfo mapRow(ResultSet rs, int rownum) throws SQLException {
		JobsInfo ji = new JobsInfo();
		ji.setCurrent_state(rs.getString("current_state"));
		ji.setJob_class(rs.getString("job_class"));
		ji.setJob_name(rs.getString("job_name"));
		ji.setLast_run_duration(rs.getString("last_run_duration"));
		ji.setLast_start_date(rs.getString("last_start_date"));
		ji.setLast_status(rs.getString("last_status"));
		ji.setNext_run_time(rs.getString("next_run_time"));
		ji.setOwner(rs.getString("owner"));
		ji.setRepeat_interval(rs.getString("repeat_interval"));
		ji.setAdditional_info(rs.getString("info"));
		return ji;
	}
}
