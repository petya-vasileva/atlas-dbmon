package atlas.dbmon.mappers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import atlas.dbmon.data.BasicInfo;
import atlas.dbmon.data.BasicInfoReversed;

public class BasicInfoConverter {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	private Map<String, Map<String,Integer>> measureinfomap = new LinkedHashMap<String, Map<String,Integer>>();
	private Map<String, Integer> thrinfomap = new HashMap<String, Integer>();
	private Map<String, String> visinfomap = new HashMap<String, String>();

	List<BasicInfoReversed> basicInfoList = new ArrayList<BasicInfoReversed>();
	
	public BasicInfoConverter(List<BasicInfo> entitylist) {
		build(entitylist);
		for (String key : thrinfomap.keySet()) {
			BasicInfoReversed bir = new BasicInfoReversed(key, visinfomap.get(key), thrinfomap.get(key), measureinfomap.get(key));
			basicInfoList.add(bir);
		}
	}

	public List<BasicInfoReversed> getBasicInfoList() {
		return basicInfoList;
	}

	protected void build(List<BasicInfo> entitylist) {
		for (BasicInfo basicInfo : entitylist) {
			Map<String,Integer> nodevaluemap = null; //new LinkedHashMap<String,Integer>();
			log.debug("Analyse obj : "+basicInfo.toString());
			if (!visinfomap.containsKey(basicInfo.getMetric())) {
				visinfomap.put(basicInfo.getMetric(), basicInfo.getVisible());
			}
			if (!thrinfomap.containsKey(basicInfo.getMetric())) {
				thrinfomap.put(basicInfo.getMetric(), basicInfo.getThreshold());
			}
			if (measureinfomap.containsKey(basicInfo.getMetric())) {
				nodevaluemap = measureinfomap.get(basicInfo.getMetric());
			}
			if (nodevaluemap == null) {
				nodevaluemap = new LinkedHashMap<String,Integer>();
			}
			String nodeid = "node"+basicInfo.getInstid();
			if (!nodevaluemap.containsKey(nodeid)) {
				nodevaluemap.put(nodeid, basicInfo.getMetricAvgCount());
			} else {
				log.debug("...strange, you have already filled this node "+nodeid);
			}
			measureinfomap.put(basicInfo.getMetric(), nodevaluemap);
		}
	}

}
