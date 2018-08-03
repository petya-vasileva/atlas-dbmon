/**
 *
 */
package atlas.dbmon.data.repositories;

import java.util.List;

import org.springframework.data.repository.query.Param;

import atlas.dbmon.data.Databases;

/**
 * @author formica
 *
 */
public interface DatabasesBaseRepository extends CondDBPageAndSortingRepository<Databases, String> {

	List<Databases> findByDbnameLike(@Param("dbname") String name);

}
