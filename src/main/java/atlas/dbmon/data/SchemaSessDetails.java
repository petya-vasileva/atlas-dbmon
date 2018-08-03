package atlas.dbmon.data;

public class SchemaSessDetails implements java.io.Serializable {

	private static final long serialVersionUID = -7705209111920210543L;
	
	private Integer inst_id;
	private Integer sid;
	private String status;
	private String osuser;
	private String process;
	private String machine;
	private String program;
	private String sql_id;
	private String event;
	private String wait_class;
	private Integer seconds_in_wait;
	private String service_name;
	
	public SchemaSessDetails() {
		super();
		// TODO Auto-generated constructor stub
	}

	public SchemaSessDetails(Integer inst_id, Integer sid, String status, String osuser, String process, String machine, String program,
			String sql_id, String event, String wait_class, Integer seconds_in_wait, String service_name) {
		super();
		this.inst_id = inst_id;
		this.sid = sid;
		this.status = status;
		this.osuser = osuser;
		this.process = process;
		this.machine = machine;
		this.program = program;
		this.sql_id = sql_id;
		this.event = event;
		this.wait_class = wait_class;
		this.seconds_in_wait = seconds_in_wait;
		this.service_name = service_name;
	}

	public Integer getInst_id() {
		return inst_id;
	}

	public void setInst_id(Integer inst_id) {
		this.inst_id = inst_id;
	}

	public Integer getSid() {
		return sid;
	}

	public void setSid(Integer sid) {
		this.sid = sid;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getOsuser() {
		return osuser;
	}

	public void setOsuser(String osuser) {
		this.osuser = osuser;
	}

	public String getProcess() {
		return process;
	}

	public void setProcess(String process) {
		this.process = process;
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

	public String getSql_id() {
		return sql_id;
	}

	public void setSql_id(String sql_id) {
		this.sql_id = sql_id;
	}

	public String getEvent() {
		return event;
	}

	public void setEvent(String event) {
		this.event = event;
	}

	public String getWait_class() {
		return wait_class;
	}

	public void setWait_class(String wait_class) {
		this.wait_class = wait_class;
	}

	public Integer getSeconds_in_wait() {
		return seconds_in_wait;
	}

	public void setSeconds_in_wait(Integer seconds_in_wait) {
		this.seconds_in_wait = seconds_in_wait;
	}

	public String getService_name() {
		return service_name;
	}

	public void setService_name(String service_name) {
		this.service_name = service_name;
	}

	@Override
	public String toString() {
		return "SchemaSessDetails [inst_id=" + inst_id + ", sid=" + sid + ", status=" + status + ", osuser=" + osuser
				+ ", process=" + process + ", machine=" + machine + ", program=" + program + ", sql_id=" + sql_id + ", event="
				+ event + ", wait_class=" + wait_class + ", seconds_in_wait=" + seconds_in_wait + ", service_name="
				+ service_name + "]";
	}

}
