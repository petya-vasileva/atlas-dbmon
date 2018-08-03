package atlas.dbmon.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import atlas.dbmon.data.BlockingSess;

public class BlockingSessMapper implements RowMapper<BlockingSess> {

	@Override
	public BlockingSess mapRow(ResultSet rs, int rownum) throws SQLException {
		BlockingSess bs = new BlockingSess();
		bs.setParent_sess_id(rs.getInt("BLOCKING_SESS_ID"));
		bs.setChild_sess_id(rs.getInt("WAITING_SESS_ID"));
		bs.setInst_id(rs.getInt("INST_ID"));
		bs.setLogon_time(rs.getString("LOGON_TIME"));
		bs.setUser_name(rs.getString("USER_NAME"));
		bs.setOs_user(rs.getString("OS_USER"));
		bs.setProgram(rs.getString("PROGRAM"));
		bs.setMachine(rs.getString("MACHINE"));
		bs.setSql_id(rs.getString("SQL_ID"));
		bs.setSql_text(rs.getString("SQL_TEXT"));
		bs.setTime_wait(rs.getInt("TIME_WAIT"));
		bs.setBlocking_on_row_address(rs.getString("blocking_on_row_address"));
		bs.setBlocking_on_table_name(rs.getString("blocking_on_table_name"));
		bs.setBlocking_on_table_owner(rs.getString("blocking_on_table_owner"));
		bs.setBlocking_sess_wait_class(rs.getString("blocking_sess_wait_class"));

		return bs;
	}
}
