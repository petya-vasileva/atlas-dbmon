/**
 * 
 */
package atlas.dbmon.data;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @author aformic
 *
 */
public class BasicInfoReversed {

	private String metric;
	private String visible;
	private Integer threshold;
	private Map<String, Integer> nodeMap = new LinkedHashMap<String,Integer>();

	public BasicInfoReversed() {
		super();
	}

	public BasicInfoReversed(String metric, String visible, Integer threshold, Map<String, Integer> nodeMap) {
		super();
		this.metric = metric;
		this.visible = visible;
		this.threshold = threshold;
		this.nodeMap = nodeMap;
	}
	
	public void setNodeMapCol(String col, Integer val) {
		nodeMap.put(col, val);
	}
	
	public Map<String, Integer> getNodeMap() {
		return nodeMap;
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

	public Integer getThreshold() {
		return threshold;
	}

	public void setThreshold(Integer threshold) {
		this.threshold = threshold;
	}
}
