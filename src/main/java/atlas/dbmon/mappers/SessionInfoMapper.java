package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.SessionInfo;

public class SessionInfoMapper implements RowMapper<SessionInfo> {

	@Override
	public SessionInfo mapRow(ResultSet rs, int rownum) throws SQLException {
		SessionInfo si = new SessionInfo();
		si.setInstid(rs.getInt("node_id"));
		si.setUser_name(rs.getString("username"));
		si.setNum_active_sess(rs.getInt("num_active_sess"));
		si.setNum_sess(rs.getInt("num_sess"));
		si.setSess_limit(rs.getInt("sess_limit"));
		si.setT_stamp(rs.getTimestamp("t_stamp"));

		return si;
	}

}