package atlas.dbmon.data;

/**
 * @author petya
 *
 */
public class BlockingSess implements java.io.Serializable {

	private Integer parent_sess_id;
	private Integer child_sess_id;
	private Integer inst_id;
	private String logon_time;
	private String user_name;
	private String os_user;
	private String program;
	private String machine;
	private String sql_id;
	private String sql_text;
	private Integer time_wait;
	private String blocking_on_table_owner;
	private String blocking_on_table_name;
	private String blocking_on_row_address;
	private String blocking_sess_wait_class;
	
	public BlockingSess() {
		super();
		// TODO Auto-generated constructor stub
	}

	public BlockingSess(Integer parent_sess_id, Integer child_sess_id, String tree, Integer depth, Integer inst_id,
			String logon_time, String user_name, String os_user, String program, String machine, String sql_id,
			String sql_text, Integer time_wait, String blocking_on_table_owner, String blocking_on_table_name, String blocking_on_row_address,
			String blocking_sess_wait_class, String prev_sql_id, String prev_sql_text) {
		super();
		this.parent_sess_id = parent_sess_id;
		this.child_sess_id = child_sess_id;
		this.inst_id = inst_id;
		this.logon_time = logon_time;
		this.user_name = user_name;
		this.os_user = os_user;
		this.program = program;
		this.machine = machine;
		this.sql_id = sql_id;
		this.sql_text = sql_text;
		this.time_wait = time_wait;
		this.blocking_on_table_owner = blocking_on_table_owner;
		this.blocking_on_table_name = blocking_on_table_name;
		this.blocking_on_row_address = blocking_on_row_address;
		this.blocking_sess_wait_class = blocking_sess_wait_class;
	}

	public Integer getParent_sess_id() {
		return parent_sess_id;
	}

	public void setParent_sess_id(Integer parent_sess_id) {
		this.parent_sess_id = parent_sess_id;
	}

	public Integer getChild_sess_id() {
		return child_sess_id;
	}

	public void setChild_sess_id(Integer child_sess_id) {
		this.child_sess_id = child_sess_id;
	}

	public Integer getInst_id() {
		return inst_id;
	}

	public void setInst_id(Integer inst_id) {
		this.inst_id = inst_id;
	}

	public String getLogon_time() {
		return logon_time;
	}

	public void setLogon_time(String logon_time) {
		this.logon_time = logon_time;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	public String getOs_user() {
		return os_user;
	}

	public void setOs_user(String os_user) {
		this.os_user = os_user;
	}

	public String getProgram() {
		return program;
	}

	public void setProgram(String program) {
		this.program = program;
	}

	public String getMachine() {
		return machine;
	}

	public void setMachine(String machine) {
		this.machine = machine;
	}

	public String getSql_id() {
		return sql_id;
	}

	public void setSql_id(String sql_id) {
		this.sql_id = sql_id;
	}

	public String getSql_text() {
		return sql_text;
	}

	public void setSql_text(String sql_text) {
		this.sql_text = sql_text;
	}

	public Integer getTime_wait() {
		return time_wait;
	}

	public void setTime_wait(Integer time_wait) {
		this.time_wait = time_wait;
	}
	
	public String getBlocking_on_table_owner() {
		return blocking_on_table_owner;
	}

	public void setBlocking_on_table_owner(String blocking_on_table_owner) {
		this.blocking_on_table_owner = blocking_on_table_owner;
	}

	public String getBlocking_on_table_name() {
		return blocking_on_table_name;
	}

	public void setBlocking_on_table_name(String blocking_on_table_name) {
		this.blocking_on_table_name = blocking_on_table_name;
	}

	public String getBlocking_on_row_address() {
		return blocking_on_row_address;
	}

	public void setBlocking_on_row_address(String blocking_on_row_address) {
		this.blocking_on_row_address = blocking_on_row_address;
	}

	public String getBlocking_sess_wait_class() {
		return blocking_sess_wait_class;
	}

	public void setBlocking_sess_wait_class(String blocking_sess_wait_class) {
		this.blocking_sess_wait_class = blocking_sess_wait_class;
	}

	@Override
	public String toString() {
		return "BlockingSess [parent_sess_id=" + parent_sess_id + ", child_sess_id=" + child_sess_id 
				+ ", inst_id=" + inst_id + ", logon_time=" + logon_time + ", user_name=" + user_name
				+ ", os_user=" + os_user + ", program=" + program + ", machine=" + machine + ", sql_id=" + sql_id + ", sql_text="
				+ sql_text + ", time_wait=" + time_wait + ", blocking_on_table_owner=" + blocking_on_table_owner
				+ ", blocking_on_table_name=" + blocking_on_table_name + ", blocking_on_row_address=" + blocking_on_row_address
				+ ", blocking_sess_wait_class=" + blocking_sess_wait_class + "]";
	}
	

}