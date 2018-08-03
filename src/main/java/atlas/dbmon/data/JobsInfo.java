package atlas.dbmon.data;

import java.time.Period;
import java.util.Date;

import javax.persistence.Column;

import org.hibernate.annotations.Type;

public class JobsInfo {

	private static final long serialVersionUID = -7705209111920210543L;

	private String owner;
	private String job_name;
	private String job_class;
	private String last_start_date;
	private String last_run_duration;
	private String last_status;
	private String current_state;
	private String next_run_time;
	private String repeat_interval;
	private String additional_info;

	public JobsInfo() {
		super();
	}

	public JobsInfo(String owner, String job_name, String job_class, String last_start_date, String last_run_duration,
			String last_status, String current_state, String next_run_time, String repeat_interval, String additional_info) {
		super();
		this.owner = owner;
		this.job_name = job_name;
		this.job_class = job_class;
		this.last_start_date = last_start_date;
		this.last_run_duration = last_run_duration;
		this.last_status = last_status;
		this.current_state = current_state;
		this.next_run_time = next_run_time;
		this.repeat_interval = repeat_interval;
		this.additional_info = additional_info;
	}

	public String getOwner() {
		return owner;
	}
	
	public void setOwner(String owner) {
		this.owner = owner;
	}
	
	public String getJob_name() {
		return job_name;
	}
	
	public void setJob_name(String job_name) {
		this.job_name = job_name;
	}
	
	public String getJob_class() {
		return job_class;
	}
	
	public void setJob_class(String job_class) {
		this.job_class = job_class;
	}
	
	public String getLast_start_date() {
		return last_start_date;
	}
	
	public void setLast_start_date(String last_start_date) {
		this.last_start_date = last_start_date;
	}
	
	public String getLast_run_duration() {
		return last_run_duration;
	}
	
	public void setLast_run_duration(String last_run_duration) {
		this.last_run_duration = last_run_duration;
	}
	
	public String getLast_status() {
		return last_status;
	}

	public void setLast_status(String last_status) {
		this.last_status = last_status;
	}
	
	public String getCurrent_state() {
		return current_state;
	}
	
	public void setCurrent_state(String current_state) {
		this.current_state = current_state;
	}
	
	public String getNext_run_time() {
		return next_run_time;
	}
	
	public void setNext_run_time(String next_run_time) {
		this.next_run_time = next_run_time;
	}
	
	public String getRepeat_interval() {
		return repeat_interval;
	}
	
	public void setRepeat_interval(String repeat_interval) {
		this.repeat_interval = repeat_interval;
	}

	public String getAdditional_info() {
		return additional_info;
	}

	public void setAdditional_info(String additional_info) {
		this.additional_info = additional_info;
	}

	@Override
	public String toString() {
		return "JobsInfo [owner=" + owner + ", job_name=" + job_name + ", job_class=" + job_class + ", last_start_date="
				+ last_start_date + ", last_run_duration=" + last_run_duration + ", last_status=" + last_status
				+ ", current_state=" + current_state + ", next_run_time=" + next_run_time + ", repeat_interval="
				+ repeat_interval + ", additional_info=" + additional_info + "]";
	}
	
}
