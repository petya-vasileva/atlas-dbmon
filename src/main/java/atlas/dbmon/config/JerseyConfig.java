package atlas.dbmon.config;

import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletProperties;
import org.springframework.stereotype.Component;

import atlas.dbmon.web.DatabasesRestController;




////@////Component
public class JerseyConfig extends ResourceConfig {

	public JerseyConfig() {          
		register(DatabasesRestController.class);
		register(MultiPartFeature.class);
		property(ServletProperties.FILTER_FORWARD_ON_404, true);
	}
	
//	@PostConstruct
	public void init() {
		 // Register components where DI is needed
	}

	public void jerseyregister(Class<?> clazz) {
		super.register(clazz);
		return;
	}
	
}