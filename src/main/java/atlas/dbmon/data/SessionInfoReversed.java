package atlas.dbmon.data;

import java.util.LinkedHashMap;
import java.util.Map;

public class SessionInfoReversed {

	private String userName;
	private String activeOutOfTotal;
	private Integer sessLimit;
	private Map<String, String> nodeMap = new LinkedHashMap<String,String>();

	public SessionInfoReversed() {
		super();
	}

	public SessionInfoReversed(String userName, String activeOutOfTotal, Integer sessLimit, Map<String, String> nodeMap) {
		super();
		this.userName = userName;
		this.activeOutOfTotal = activeOutOfTotal;
		this.sessLimit = sessLimit;
		this.nodeMap = nodeMap;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getActiveOutOfTotal() {
		return activeOutOfTotal;
	}

	public void setActiveOutOfTotal(String activeOutOfTotal) {
		this.activeOutOfTotal = activeOutOfTotal;
	}

	public Integer getSessLimit() {
		return sessLimit;
	}

	public void setSessLimit(Integer sessLimit) {
		this.sessLimit = sessLimit;
	}

	public void setNodeMapCol(String col, String val) {
		nodeMap.put(col, val);
	}

	public Map<String, String> getNodeMap() {
		return nodeMap;
	}
}
