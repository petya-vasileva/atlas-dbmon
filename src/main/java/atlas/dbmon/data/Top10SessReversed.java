package atlas.dbmon.data;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Top10SessReversed {
	
	private Map<String, Map<String, List<Top10Sess>>> nodeMap = new LinkedHashMap<String, Map<String, List<Top10Sess>>>();

	public Top10SessReversed() {
		super();
	}
	
	public Top10SessReversed(Map<String, Map<String, List<Top10Sess>>> nodeMap) {
		this.nodeMap = nodeMap;
	}

	public Map<String, Map<String, List<Top10Sess>>> getNodeMap() {
		return nodeMap;
	}

	public void setNodeMap(Map<String, Map<String, List<Top10Sess>>> nodeMap) {
		this.nodeMap = nodeMap;
	}
}
