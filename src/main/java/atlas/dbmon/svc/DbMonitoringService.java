/**
 * 
 */
package atlas.dbmon.svc;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import atlas.dbmon.data.*;
import atlas.dbmon.data.repositories.DatabasesBaseRepository;
import atlas.dbmon.data.repositories.JdbcMonitoringRepository;

/**
 * @author aformic
 *
 */
@Service
public class DbMonitoringService {

	@Autowired
	private DatabasesBaseRepository dbRepository;
	@Autowired
	private JdbcMonitoringRepository jdbcRepository;

	public List<Databases> findDatabases(String dbname) throws ConddbServiceException {
		try {
			return dbRepository.findByDbnameLike(dbname);
		} catch (Exception e) {
			throw new ConddbServiceException(e.getMessage());
		}
	}
	
	public List<Databases> findAllDatabases() throws ConddbServiceException {
		try {
			Iterable<Databases> dbases =  dbRepository.findAll();
			List<Databases> dtolist = null;
			dtolist = StreamSupport.stream(dbases.spliterator(), false).collect(Collectors.toList());
			return dtolist;
		} catch (Exception e) {
			throw new ConddbServiceException(e.getMessage());
		}
	}

	// The only method that seems to be actively used. (Query performance)
	public Databases getDatabases(String dbname) throws ConddbServiceException {
		try {

			return dbRepository.findOne(dbname);
		} catch (Exception e) {
			throw new ConddbServiceException(e.getMessage());
		}
	}
	
	public List<BasicInfo> findBasicInfoForDbname(String dbname, Integer nminutes)  throws ConddbServiceException {
		try {
			Databases dbentity = dbRepository.findOne(dbname);
			return jdbcRepository.selectBasicInfo(dbentity.getDbname(),nminutes);
			
		} catch (Exception e) {
			throw new ConddbServiceException(e.getMessage());
		}
	}

}
