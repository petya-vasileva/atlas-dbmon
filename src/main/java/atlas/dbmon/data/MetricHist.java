/**
 * 
 */
package atlas.dbmon.data;

import java.sql.Timestamp;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

/**
 * @author aformic,petya
 *
 */
public class MetricHist implements java.io.Serializable {
	
	private Timestamp tStamp;
	private String hour;
	private String mins;
	private String metric;
	private Integer val;

	
	public MetricHist() {
		super();
	}


	public MetricHist(Timestamp tstamp, String hour, String mins, String metric, Integer val) {
		super();
		this.tStamp = tstamp;
		this.hour = hour;
		this.mins = mins;
		this.metric = metric;
		this.val = val;
	}
	
	
	//@JsonDeserialize(using = TimestampDeserializer.class)
	public Timestamp gettStamp() {
		return tStamp;
	}

	public void settStamp(Timestamp tStamp) {
		this.tStamp = tStamp;
	}

	public String getHour() {
		return hour;
	}



	public void setHour(String hour) {
		this.hour = hour;
	}



	public String getMins() {
		return mins;
	}



	public void setMins(String mins) {
		this.mins = mins;
	}



	public String getMetric() {
		return metric;
	}



	public void setMetric(String metric) {
		this.metric = metric;
	}



	public Integer getVal() {
		return val;
	}



	public void setVal(Integer val) {
		this.val = val;
	}

	@Override
	public String toString() {
		return "MetricHist [tStamp=" + tStamp + ", hour=" + hour + ", mins=" + mins + ", metric=" + metric + ", val="
				+ val + "]";
	}
}
