package atlas.dbmon.mappers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import atlas.dbmon.data.Top10Sess;
import atlas.dbmon.data.Top10SessReversed;


public class Top10SessConverter {
	private Logger log = LoggerFactory.getLogger(this.getClass());
	Map<String, Map<String, List<Top10Sess>>> finalmap = new HashMap<>();

	List<Top10SessReversed> top10List = new ArrayList<Top10SessReversed>();
	
	public Top10SessConverter(List<Top10Sess> entitylist) {
		build(entitylist);
		Top10SessReversed top = new Top10SessReversed(finalmap);
		top10List.add(top);
	}

	public List<Top10SessReversed> getTop10List() {
		return top10List;
	}
	
	protected void build(List<Top10Sess> entitylist) {
		Map<Integer, Long> nodeidmap = entitylist.stream().collect(
				Collectors.groupingBy(Top10Sess::getInstId, Collectors.counting()));


		Map<String, List<Top10Sess>> chartmap = null;

		for (Integer inode : nodeidmap.keySet()) {
			String nodename = "node" + inode.toString();
			if (finalmap.containsKey(nodename))
				continue;

			System.out.println("node " + inode + " number of entries = " + nodeidmap.get(inode));
			List<Top10Sess> nodeidlist = entitylist.stream().filter(p -> p.getInstId().equals(inode))
					.collect(Collectors.toList());

			chartmap = nodeidlist.stream().collect(Collectors.groupingBy(p -> (p.getChartType())));
			if (!finalmap.containsKey(nodename)) {
				finalmap.put(nodename, chartmap);
			}
		}
	}
}
