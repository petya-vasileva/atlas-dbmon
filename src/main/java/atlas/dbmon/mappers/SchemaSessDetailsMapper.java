package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.SchemaSessDetails;

public class SchemaSessDetailsMapper implements RowMapper<SchemaSessDetails> {

	@Override
	public SchemaSessDetails mapRow(ResultSet rs, int rownum) throws SQLException {
		SchemaSessDetails sd = new SchemaSessDetails();
		sd.setInst_id(rs.getInt("inst_id"));
		sd.setSid(rs.getInt("sid"));
		sd.setMachine(rs.getString("machine"));
		sd.setOsuser(rs.getString("osuser"));
		sd.setProgram(rs.getString("program"));
		sd.setEvent(rs.getString("event"));
		sd.setProcess(rs.getString("process"));
		sd.setSeconds_in_wait(rs.getInt("seconds_in_wait"));
		sd.setService_name(rs.getString("service_name"));
		sd.setSql_id(rs.getString("sql_id"));
		sd.setStatus(rs.getString("status"));
		sd.setWait_class(rs.getString("wait_class"));

		return sd;
	}

}
