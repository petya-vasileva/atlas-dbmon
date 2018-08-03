package atlas.dbmon.data;

public class SchemaSessions implements java.io.Serializable {

	private static final long serialVersionUID = -7705209111920210543L;

	private Integer node_id;
	private String username;
	private Integer num_active_sess;
	private Integer num_sess;
	private String osuser;
	private String machine;
	private String program;

	public SchemaSessions() {
		super();
		// TODO Auto-generated constructor stub
	}

	public SchemaSessions(Integer node_id, String username, Integer num_active_sess, Integer num_sess, String osuser,
			String machine, String program) {
		super();
		this.node_id = node_id;
		this.username = username;
		this.num_active_sess = num_active_sess;
		this.num_sess = num_sess;
		this.osuser = osuser;
		this.machine = machine;
		this.program = program;
	}

	public Integer getNode_id() {
		return node_id;
	}

	public void setNode_id(Integer node_id) {
		this.node_id = node_id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Integer getNum_active_sess() {
		return num_active_sess;
	}

	public void setNum_active_sess(Integer num_active_sess) {
		this.num_active_sess = num_active_sess;
	}

	public Integer getNum_sess() {
		return num_sess;
	}

	public void setNum_sess(Integer num_sess) {
		this.num_sess = num_sess;
	}

	public String getOsuser() {
		return osuser;
	}

	public void setOsuser(String osuser) {
		this.osuser = osuser;
	}

	public String getMachine() {
		return machine;
	}

	public void setMachine(String machine) {
		this.machine = machine;
	}

	public String getProgram() {
		return program;
	}

	public void setProgram(String program) {
		this.program = program;
	}

	@Override
	public String toString() {
		return "SchemaSessions [node_id=" + node_id + ", userName=" + username + ", num_active_sess=" + num_active_sess
				+ ", num_sess=" + num_sess + ", osuser=" + osuser + ", machine=" + machine + ", program=" + program + "]";
	}

}
