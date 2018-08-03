package atlas.dbmon.mappers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import atlas.dbmon.data.SessionInfo;
import atlas.dbmon.data.SessionInfoReversed;

public class SessionInfoConverter {
	private Logger log = LoggerFactory.getLogger(this.getClass());

	private Map<String, Map<String,String>> sessinfomap = new LinkedHashMap<String, Map<String,String>>();
	private Map<String, Integer> userName = new HashMap<String, Integer>();
	private Map<String, List<Integer>> activeinfomap = new HashMap<String, List<Integer>>();
	private Map<String, List<Integer>> totalinfomap = new HashMap<String, List<Integer>>();

	List<SessionInfoReversed> sessionInfoList = new ArrayList<SessionInfoReversed>();
	
	public SessionInfoConverter(List<SessionInfo> entitylist) {
		build(entitylist);
		String activeOutOfTotal;
		for (String key : userName.keySet()) {
			activeOutOfTotal = Integer.toString(activeinfomap.get(key).stream().mapToInt(Integer::intValue).sum())
					+ "/" + Integer.toString(totalinfomap.get(key).stream().mapToInt(Integer::intValue).sum()) ;
			SessionInfoReversed sir = new SessionInfoReversed(key, activeOutOfTotal, userName.get(key), sessinfomap.get(key));
			sessionInfoList.add(sir);
		}
	}

	public List<SessionInfoReversed> getSessionInfoList() {
		return sessionInfoList;
	}

	protected void build(List<SessionInfo> entitylist) {
		int act, tot;
		List<Integer> maplist;
		for (SessionInfo sessionInfo : entitylist) {
			Map<String,String> nodevaluemap = null;
			log.debug("Analyse obj : "+sessionInfo.toString());

			if (!userName.containsKey(sessionInfo.getUser_name())) {
				userName.put(sessionInfo.getUser_name(), sessionInfo.getSess_limit());
			}

			// get all active sessions for each account
			if(activeinfomap.containsKey(sessionInfo.getUser_name())){
			    maplist = activeinfomap.get(sessionInfo.getUser_name());
			    maplist.add(sessionInfo.getNum_active_sess());
			} else {
			    maplist = new ArrayList<Integer>();
			    maplist.add(sessionInfo.getNum_active_sess());
			    activeinfomap.put(sessionInfo.getUser_name(), maplist);
			}

			// get total number of sessions for each account
			if(totalinfomap.containsKey(sessionInfo.getUser_name())){
			    maplist = totalinfomap.get(sessionInfo.getUser_name());
			    maplist.add(sessionInfo.getNum_sess());
			} else {
			    maplist = new ArrayList<Integer>();
			    maplist.add(sessionInfo.getNum_sess());
			    totalinfomap.put(sessionInfo.getUser_name(), maplist);
			}

			if (sessinfomap.containsKey(sessionInfo.getUser_name())) {
				nodevaluemap = sessinfomap.get(sessionInfo.getUser_name());
			}
			if (nodevaluemap == null) {
				nodevaluemap = new LinkedHashMap<String,String>();
			}
			String nodeid = "node"+sessionInfo.getInstid();
			if (!nodevaluemap.containsKey(nodeid)) {
				act = sessionInfo.getNum_active_sess();
				tot = sessionInfo.getNum_sess();
				if (act == 0 && tot == 0) {
					nodevaluemap.put(nodeid, "");
				}
				else {
					String values = Integer.toString(act) + "/" + Integer.toString(tot);
					nodevaluemap.put(nodeid, values);
				}
			} else {
				log.debug("...strange, you have already filled this node " + nodeid);
			}

			sessinfomap.put(sessionInfo.getUser_name(), nodevaluemap);
		}
	}

}
