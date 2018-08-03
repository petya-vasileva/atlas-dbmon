package atlas.dbmon.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import atlas.dbmon.data.repositories.JdbcMonitoringRepository;


@Configuration
@ComponentScan("atlas.dbmon.data.repositories")
public class RepositoryConfig {
	
	@Autowired
	private CrestProperties cprops;
	
//    @Profile({"default","prod","dev","wildfly"})
//    @Bean(name = "jdbcMonitoringRepository")
//    public JdbcMonitoringRepository jdbcMonitoringRepository(@Qualifier("daoDataSource") DataSource mainDataSource) {
//    		JdbcMonitoringRepository bean = new JdbcMonitoringRepository(mainDataSource);
//		return bean;
//    }
   

}