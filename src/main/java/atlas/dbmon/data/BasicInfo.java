/**
 * 
 */
package atlas.dbmon.data;

/**
 * @author formica
 *
 */
public class BasicInfo implements java.io.Serializable {

	private static final long serialVersionUID = -7705209111920210543L;

	private String  metric;
	private String visible;
	private String  unit;
	private Integer instid;
	private Integer metricAvgCount;
	private Integer threshold;

	public BasicInfo() {
		super();
	}
	
	public String getMetric() {
		return metric;
	}

	public void setMetric(String metric) {
		this.metric = metric;
	}

	public String getVisible() {
		return visible;
	}

	public void setVisible(String visible) {
		this.visible = visible;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Integer getInstid() {
		return instid;
	}

	public void setInstid(Integer instid) {
		this.instid = instid;
	}

	public Integer getMetricAvgCount() {
		return metricAvgCount;
	}

	public void setMetricAvgCount(Integer metricAvgCount) {
		this.metricAvgCount = metricAvgCount;
	}

	public Integer getThreshold() {
		return threshold;
	}

	public void setThreshold(Integer threshold) {
		this.threshold = threshold;
	}

	@Override
	public String toString() {
		return "BasicInfo [metric=" + metric + ", unit=" + unit + ", instid=" + instid + ", metricAvgCount="
				+ metricAvgCount + ", threshold=" + threshold + " visible=" + visible + "]";
	}
}
