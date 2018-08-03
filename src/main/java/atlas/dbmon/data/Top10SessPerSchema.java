package atlas.dbmon.data;

/**
 * @author petya
 *
 */
public class Top10SessPerSchema implements java.io.Serializable {

	private Integer instId;
	private String chartType;
	private String parsingSchema;
	private String name;
	private float y;
	private String metricUnit;
	private String sqlText;

	
	public Top10SessPerSchema() {
		super();
	}


	public Top10SessPerSchema(Integer instId, String chartType, String parsingSchema, String name, float y, String metricUnit, String sqlText) {
		super();
		this.instId = instId;
		this.chartType = chartType;
		this.parsingSchema = parsingSchema;
		this.name = name;
		this.y = y;
		this.metricUnit  = metricUnit;
		this.sqlText = sqlText;
	}

	public Integer getInstId() {
		return instId;
	}


	public void setInstId(Integer instId) {
		this.instId = instId;
	}


	public String getChartType() {
		return chartType;
	}


	public void setChartType(String chartType) {
		this.chartType = chartType;
	}


	public String getParsingSchema() {
		return parsingSchema;
	}


	public void setParsingSchema(String parsingSchema) {
		this.parsingSchema = parsingSchema;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public float getY() {
		return y;
	}


	public void setY(float y) {
		this.y = y;
	}


	public String getMetricUnit() {
		return metricUnit;
	}


	public void setMetricUnit(String metricUnit) {
		this.metricUnit = metricUnit;
	}


	public String getSqlText() {
		return sqlText;
	}


	public void setSqlText(String sqlText) {
		this.sqlText = sqlText;
	}


	@Override
	public String toString() {
		return "Top10Sess [instId=" + instId + ", chartType=" + chartType + ", parsingSchema=" + parsingSchema + ", name=" + name
				+ ", y=" + y + ", metricUnit=" + metricUnit + ", sqlText=" + sqlText + "]";
	}

}
