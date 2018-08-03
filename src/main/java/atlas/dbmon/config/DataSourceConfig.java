package atlas.dbmon.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DataSourceConfig {
 
	@Autowired
	private CrestProperties cprops;

	@Autowired
	private DataSource ds;
	
//	@Primary
//	@ConfigurationProperties(prefix="spring.datasource")
//    @Bean(name = "daoDataSource")
//    public DataSource createMainDataSource() {
//	    return DataSourceBuilder.create().build();
//    }
	
//    @Profile({"default","prod","dev","wildfly","undertow"})
//    @Bean(name = "jdbcMainTemplate")
//    @Autowired
//    public JdbcTemplate getMainTemplate() {
//    		return new JdbcTemplate(ds);
//    }
    
  @Bean(name = "jdbcMainTemplate")
  public JdbcTemplate getMainTemplate() {
		return new JdbcTemplate(ds);
}
//  @Autowired
	
}