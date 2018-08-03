package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.SchemaSessions;

public class SchemaSessesionsMapper implements RowMapper<SchemaSessions> {

	@Override
	public SchemaSessions mapRow(ResultSet rs, int rownum) throws SQLException {
		SchemaSessions ss = new SchemaSessions();
		ss.setMachine(rs.getString("machine"));
		ss.setNode_id(rs.getInt("node_id"));
		ss.setNum_active_sess(rs.getInt("num_active_sess"));
		ss.setNum_sess(rs.getInt("num_sess"));
		ss.setOsuser(rs.getString("osuser"));
		ss.setProgram(rs.getString("program"));
		ss.setUsername(rs.getString("username"));

		return ss;
	}

}
