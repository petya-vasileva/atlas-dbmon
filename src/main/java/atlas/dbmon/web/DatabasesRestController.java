/**
 * 
 */
package atlas.dbmon.web;

import java.math.BigDecimal;
import java.util.List;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import atlas.dbmon.data.AWRInfo;
import atlas.dbmon.data.BasicInfo;
import atlas.dbmon.data.BasicInfoReversed;
import atlas.dbmon.data.BlockingSess;
import atlas.dbmon.data.Databases;
import atlas.dbmon.data.ExpPlan;
import atlas.dbmon.data.JobsInfo;
import atlas.dbmon.data.SchemaDetailsInfo;
import atlas.dbmon.data.SchemaSessDetails;
import atlas.dbmon.data.SchemaSessions;
import atlas.dbmon.data.SessionInfo;
import atlas.dbmon.data.SessionInfoReversed;
import atlas.dbmon.data.StorageInfo;
import atlas.dbmon.data.StreamsInfo;
import atlas.dbmon.data.Top10Sess;
import atlas.dbmon.data.Top10SessReversed;
import atlas.dbmon.data.repositories.JdbcMonitoringRepository;
import atlas.dbmon.mappers.BasicInfoConverter;
import atlas.dbmon.mappers.SessionInfoConverter;
import atlas.dbmon.mappers.Top10SessConverter;
import atlas.dbmon.svc.ConddbServiceException;
import atlas.dbmon.svc.DbMonitoringService;
import atlas.dbmon.web.exceptions.ConddbWebException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

/**
 * @author aformic
 *
 */
@Path("/databases")
@Controller
@Api(value = "/databases")
public class DatabasesRestController {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private DbMonitoringService dbMonitoringService;
	@Autowired
	private JdbcMonitoringRepository jdbcMonitoringRepository;
	
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/{dbname}")
	@ApiOperation(value = "Finds Databases by name", notes = "Usage of % allows to select based on patterns", response = Databases.class, responseContainer = "List")
	public Response getDatabases(@Context UriInfo info,
			@ApiParam(value = "name pattern for the search", required = true) @PathParam("dbname") final String dbname,
			@ApiParam(value = "expand {true|false} is for parameter expansion", required = false) @DefaultValue("true") @QueryParam("expand") boolean expand)
			throws ConddbWebException {
		this.log.info("DatabasesRestController processing request to get DB name " + dbname);

		try {
			CacheControl control = new CacheControl();
			control.setMaxAge(600);
			if (dbname.contains("%")) {
				// CollectionResource collres = listToCollection(dblist, false, info);
				List<Databases> dtolist = this.dbMonitoringService.findDatabases(dbname);
				GenericEntity<List<Databases>> entitylist = new GenericEntity<List<Databases>>(dtolist) {
				};
				return Response.ok().entity(entitylist).build();

			} else {
				Databases entity = null;
				entity = this.dbMonitoringService.getDatabases(dbname);
				if (entity == null) {
					String msg = "Database not found for id " + dbname;
					ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
					
					return Response.status(Response.Status.NOT_FOUND).entity(resp).build();
				}
				// entity.setResId(entity.getDbname());
				// DatabasesResource res = (DatabasesResource)
				// springResourceFactory.getResource("databases", info, entity);
				return Response.ok().entity(entity).build();
			}
		} catch (ConddbServiceException e) {
			String msg = "Error retrieving globaltag resource ";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();
		}
	}

	@SuppressWarnings("unchecked")
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@ApiOperation(value = "Finds all Databases", notes = "Usage of url argument expand={true|false} in order to see full resource content or href links only", response = Databases.class, responseContainer = "List")
	public Response listDatabases(@Context UriInfo info,
			@ApiParam(value = "expand {true|false} is for parameter expansion", required = false) @DefaultValue("true") @QueryParam("expand") boolean expand)
			throws ConddbWebException {
		this.log.info("DatabasesRestController processing request for databases list (expansion = " + expand + ")");
		List<Databases> databases = null;
		try {
			// Here we could implement pagination
			databases = this.dbMonitoringService.findAllDatabases();
			GenericEntity<List<Databases>> entitylist = new GenericEntity<List<Databases>>(databases) {
			};
			if (entitylist == null || entitylist.getEntity().size() == 0) {
				String msg = "Error in creation of databases collection";
				ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
				return Response.status(Response.Status.NOT_FOUND).entity(resp).build();
			}
			return Response.ok().entity(entitylist).build();

		} catch (ConddbServiceException e) {
			String msg = "Error in creation of databases collection";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();
		}
	}
//################################################################################################
	//BSCHEER testing
	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/info/{dbname}")
	//extract/inject parameters from the url
	public Response getBasicInfo(@Context UriInfo info,
			@PathParam("dbname") String dbname,
			@DefaultValue("5") @QueryParam("nminutes") final Integer nminutes) throws ConddbWebException {
		//writing basic informations about the request to the log
		this.log.info(
				"DatabasesRestController processing request for getBasicInfo: basic metrics for database " + dbname);
		// declaration of the List with the response of the service
		List<BasicInfo> basicinfolist = null;
		
		//just for test purpose
		System.out.println(dbname);
		
		try {
			// calls the method with the SQL-Query
			basicinfolist = jdbcMonitoringRepository.selectBasicInfo(dbname, nminutes);
			//reverses the list
			List<BasicInfoReversed> reversedlist = new BasicInfoConverter(basicinfolist).getBasicInfoList();
			//returns reversed list
			return Response.ok().entity(reversedlist).build();
		
		//Exception-handling
		} catch (Exception e) {
			String msg = "Error in creation of basicinfo collection";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();
		}
	}
//################################################################################################

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/charts/{dbname}/period")
	public Response getTop10ActiveSess(@Context UriInfo info,
			@PathParam("dbname") String dbname,
			@QueryParam("from") String from,
			@QueryParam("to") String to) throws ConddbWebException {
		this.log.info("DatabasesRestController processing request for getTop10ActiveSess: " + " for database " + dbname
				+ " and period from " + from + " to " + to);

		List<Top10Sess> top10sesslist = null;
		try {
			top10sesslist = jdbcMonitoringRepository.selectTop10Sess(dbname, from, to);
			List<Top10SessReversed> reversedlist = new Top10SessConverter(top10sesslist).getTop10List();
			return Response.ok().entity(reversedlist).build();
		} catch (Exception e) {
			String msg = "Error in creation of chart values collection";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();
		}
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/sessinfo")
	public Response getSessionInfo(@Context UriInfo info,
			@QueryParam("dbname") String dbName)
			throws ConddbWebException {
		this.log.info(
				"DatabasesRestController processing request for getBasicInfo: basic metrics for database " + dbName);
		List<SessionInfo> sessionInfolist = null;
		try {
			sessionInfolist = jdbcMonitoringRepository.selectSessionInfo(dbName);
			List<SessionInfoReversed> reversedlist = new SessionInfoConverter(sessionInfolist).getSessionInfoList();
			return Response.ok().entity(reversedlist).build();
		} catch (Exception e) {
			String msg = "Error in creation of sessioninfo collection";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();		}
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/{db}/streaminfo")
	public Response getStreamInfo(@Context UriInfo info,
			@PathParam("db") String db,
			@QueryParam("node") Integer node,
			@QueryParam("metric") Integer metric,
			@QueryParam("from") String from,
			@QueryParam("to") String to) throws ConddbWebException {
		this.log.info("DatabasesRestController processing request for getStreamInfo for " + db + " from " +from+ " to " + to);
		List<StreamsInfo> streamsinfolist = null;
		try {
			streamsinfolist = jdbcMonitoringRepository.selectStreamsInfo(db, node, metric, from, to);
//			this.log.info(streamsinfolist.toString());
			return Response.ok().entity(streamsinfolist).build();
		} catch (Exception e) {
			String msg = "Error in creation of expPlanList";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();
		}
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/{dbName}/explan")
	public Response getExplan(@Context UriInfo info,
			@PathParam("dbName") String dbName,
			@QueryParam("sqlId") String sqlId) throws ConddbWebException {
		this.log.info("DatabasesRestController processing request for getExpPlan: explain plan for database " + dbName);
		List<ExpPlan> expPlanList = null;
		try {
			expPlanList = jdbcMonitoringRepository.selectExpPlan(dbName, sqlId);
			return Response.ok().entity(expPlanList).build();
		} catch (Exception e) {
			String msg = "Error in creation of expPlanList";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();		
		}
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/{dbName}/awrinfo")
	public Response getAWRInfo(@Context UriInfo info,
			@PathParam("dbName") String dbName,
			@QueryParam("sqlId") String sqlId) throws ConddbWebException {
		this.log.info("DatabasesRestController processing request for getAWRInfo for database " + dbName
				+ " sqlId: " + sqlId);
		List<AWRInfo> awrInfoList = null;
		try {
			awrInfoList = jdbcMonitoringRepository.selectAWRInfo(dbName, sqlId);
			return Response.ok().entity(awrInfoList).build();
		} catch (Exception e) {
			String msg = "Error in creation of awrInfoList";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();
		}
	}


	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/jobs")
	public Response getJobsInfo(@Context UriInfo info,
			@QueryParam("db") String dbName,
			@QueryParam("schema") String schema) throws ConddbWebException {
		this.log.info(
				"DatabasesRestController processing request for getJobsInfo: jobs details for database " + dbName);
		List<JobsInfo> jobsInfoList = null;
		try {
			jobsInfoList = jdbcMonitoringRepository.selectJobsInfo(dbName, schema);
			return Response.ok().entity(jobsInfoList).build();
		} catch (Exception e) {
			String msg = "Error in creation of jobsInfoList";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();		
		}
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/{dbName}/storage")
	public Response getStorageInfo(@Context UriInfo info,
			@PathParam("dbName") String dbName,
			@QueryParam("schema") String schemaName,
			@QueryParam("year") int year) throws ConddbWebException {
		this.log.info(
				"DatabasesRestController processing request for getStorageInfo: storage info for database " + dbName);
		List<StorageInfo> storageInfoList = null;
		try {
			storageInfoList = jdbcMonitoringRepository.selectStorageInfo(dbName, schemaName, year);
			return Response.ok().entity(storageInfoList).build();
		} catch (Exception e) {
			String msg = "Error in creation of storageInfoList";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();		
		}
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/{dbName}/allSchemas")
	public Response getAllSchemas(@Context UriInfo info,
			@PathParam("dbName") String dbName) throws ConddbWebException {
		this.log.info("DatabasesRestController processing request for getAllSchemas.");
		List<String> schemaList = null;
		try {
			schemaList = jdbcMonitoringRepository.selectAllSchemas(dbName);
			return Response.ok().entity(schemaList).build();
		} catch (Exception e) {
			String msg = "Error in creation of schemaList";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();		
		}
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/schemaDetails")
	public Response getSchemaDetails(@Context UriInfo info,
			@QueryParam("schema") String schemaName,
			@QueryParam("db") String dbName) throws ConddbWebException {
		this.log.info("DatabasesRestController processing request for getSchemaDetails.");
		List<SchemaDetailsInfo> detailsList = null;
		try {
			detailsList = jdbcMonitoringRepository.selectSchemaDetails(schemaName, dbName);
			return Response.ok().entity(detailsList).build();
		} catch (Exception e) {
			String msg = "Error in creation of detailsList";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();		
		}
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/sesssions")
	public Response getSchemaSessions(@Context UriInfo info,
			@QueryParam("schema") String schemaName,
			@QueryParam("db") String dbName) throws ConddbWebException {
		this.log.info("DatabasesRestController processing request for getSchemaSessions.");
		List<SchemaSessions> sessList = null;
		try {
			sessList = jdbcMonitoringRepository.selectSchemaSessions(schemaName, dbName);
			return Response.ok().entity(sessList).build();
		} catch (Exception e) {
			String msg = "Error in creation of sessList";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();		
		}
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/sessionschart")
	public Response getSchemaSessionsCharts(@Context UriInfo info,
			@QueryParam("db") String dbName,
			@QueryParam("schema") String schemaName,
			@QueryParam("fromDate") String fromDate,
			@QueryParam("toDate") String toDate,
			@QueryParam("node") Integer node) throws ConddbWebException {
		this.log.info("DatabasesRestController processing request for getSchemaSessions.");
		List<SessionInfo> sessionInfolist = null;
		try {
			sessionInfolist = jdbcMonitoringRepository.selectSessionChartInfo(dbName, schemaName, fromDate, toDate, node);
			return Response.ok().entity(sessionInfolist).build();
		} catch (Exception e) {
			String msg = "Error in creation of sessList";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();
		}
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/sesssionDetails")
	public Response getSchemaSessDetails(@Context UriInfo info,
			@QueryParam("schema") String schemaName,
			@QueryParam("db") String dbName) throws ConddbWebException {
		this.log.info("DatabasesRestController processing request for getSchemaSessions.");
		List<SchemaSessDetails> sessList = null;
		try {
			sessList = jdbcMonitoringRepository.selectSchemaSessDetails(schemaName, dbName);
			return Response.ok().entity(sessList).build();
		} catch (Exception e) {
			String msg = "Error in creation of sessList";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();		
		}
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/schemaCharts")
	public Response getTop10PerSchema(@Context UriInfo info,
			@QueryParam("db") String db,
			@QueryParam("node") int node,
			@QueryParam("schema") String schema,
			@QueryParam("from") String from,
			@QueryParam("to") String to)
			throws ConddbWebException {
		this.log.info("DatabasesRestController processing request for getTop10PerSchema: " + " for database " + db
				+ " and period from " + from + " to " + to);

		List<Top10Sess> top10sesslist = null;
		try {
			top10sesslist = jdbcMonitoringRepository.selectTop10SessPerSchema(db, node, schema, from, to);
			List<Top10SessReversed> reversedlist = new Top10SessConverter(top10sesslist).getTop10List();
			return Response.ok().entity(reversedlist).build();
		} catch (Exception e) {
			String msg = "Error in creation of chart values collection";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();		
		}
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/schemaNodes")
	public Response getSchemaSessNodes(@Context UriInfo info,
			@QueryParam("schema") String schema,
			@QueryParam("db") String db) throws ConddbWebException {
		this.log.info("DatabasesRestController processing request for getSchemaSessNodes.");
		List<BigDecimal> schemaNodes = null;
		try {
			schemaNodes = jdbcMonitoringRepository.selectSchemaSessNodes(db, schema);
			return Response.ok().entity(schemaNodes).build();
		} catch (Exception e) {
			String msg = "Error in creation of top10List";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();		
		}
	}

	@GET
	@Produces({ MediaType.APPLICATION_JSON })
	@Path("/blocking_sessions")
	public Response getBlockingSess(
			@QueryParam("db") String db,
			@QueryParam("from") String from,
			@QueryParam("to") String to,
			@Context UriInfo info) throws ConddbWebException {
		this.log.info("DatabasesRestController processing request for BlockingSess.");
		List<BlockingSess> bs = null;
		try {
			bs = jdbcMonitoringRepository.selectBlockingSessions(db, from, to);
			return Response.ok().entity(bs).build();
		} catch (Exception e) {
			String msg = "Error in creation of BlockingSess";
			ApiResponseMessage resp = new ApiResponseMessage(ApiResponseMessage.ERROR, msg);
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(resp).build();		
		}
	}

}
