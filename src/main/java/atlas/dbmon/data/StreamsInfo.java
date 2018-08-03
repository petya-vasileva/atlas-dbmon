package atlas.dbmon.data;

import java.sql.Timestamp;

public class StreamsInfo implements java.io.Serializable {

	private static final long serialVersionUID = -7705209111920210543L;

	private Timestamp   t_stamp;
	private Integer  metric_value;

	public StreamsInfo() {
		super();
	}

	public Timestamp getT_stamp() {
		return t_stamp;
	}

	public void setT_stamp(Timestamp t_stamp) {
		this.t_stamp = t_stamp;
	}

	public Integer getMetric_value() {
		return metric_value;
	}

	public void setMetric_value(Integer metric_value) {
		this.metric_value = metric_value;
	}

	@Override
	public String toString() {
		return "StreamsInfo [t_stamp=" + t_stamp + ", metric_value=" + metric_value + "]";
	}

}
