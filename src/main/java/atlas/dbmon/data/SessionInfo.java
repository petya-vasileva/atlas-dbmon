package atlas.dbmon.data;

import java.sql.Timestamp;

public class SessionInfo implements java.io.Serializable {

	private static final long serialVersionUID = -7705209111920210543L;

	private Integer inst_id;
	private String user_name;
	private Integer num_active_sess;
	private Integer num_sess;
	private Integer sess_limit;
	private Timestamp t_stamp;

	public SessionInfo() {
		super();
	}

	public Integer getInstid() {
		return inst_id;
	}

	public void setInstid(Integer instid) {
		this.inst_id = instid;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
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

	public Integer getSess_limit() {
		return sess_limit;
	}

	public void setSess_limit(Integer sess_limit) {
		this.sess_limit = sess_limit;
	}

	public Timestamp getT_stamp() {
		return t_stamp;
	}

	public void setT_stamp(Timestamp t_stamp) {
		this.t_stamp = t_stamp;
	}

	@Override
	public String toString() {
		return "SessionInfo [inst_id=" + inst_id + ", user_name=" + user_name + ", num_active_sess=" + num_active_sess
				+ ", num_sess=" + num_sess + ", sess_limit=" + sess_limit + ", t_stamp=" + t_stamp + "]";
	}
}
