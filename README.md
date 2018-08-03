#### Author: A.Formica, P.Vasileva
##### Date of last development period: 2017/10/01 
```
   Copyright (C) 2016  A.Formica, P.Vasileva

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
```
# Table of Contents
1. [Description](#description)
2. [Installation](#installation)
3. [Build instructions](#build-instructions)
4. [Run the server](#run-the-server)
6. [Docker](#docker)
7. [Openshift](#openshift)

## Description
ATLAS Database & Application Activity project.

The prototype uses [Spring framework](https://spring.io) and the REST services are implemented via  [Jersey](https://jersey.java.net).

The prototype runs as a microservice using `spring-boot`. By default it uses an embedded [undertow](http://undertow.io) servlet container, but others like [tomcat](https://tomcat.apache.org) or [jetty](https://www.eclipse.org/jetty/) can be easily used instead of [undertow](http://undertow.io).


## Installation
Download the project from gitlab (example below is using `https`):
```
git clone https://gitlab.cern.ch/formica/AtlGradleDbMon.git
```
This will create a directory `AtlGradleDbMon` in the location where you run the git command.

## Build instructions
You need to have java >= 8 installed on your machine. If you have also [gradle](https://gradle.org) (version 5) you can build the project using the following command from the root project directory (`AtlGradleDbMon`):
```
gradle clean build -PwarName=dbmon.war
```
This command will generate a war (java web archive) file in  : `./build/libs/dbmon.war`.
In case gradle is not installed on your machine, you can run the wrapper delivered with the project:
```
./gradlew clean build -PwarName=dbmon.war
```

## Run the server
This section is under maintenance.

To run the server, you can either start an embedded tomcat (or undertow) web server via spring boot, or deploy the generated war file in an existing tomcat instance. The embedded server type is specified in the `crest-filter-values.properties` file:
```
server=undertow
jaxrs=jersey
```
or
```
server=tomcat
jaxrs=jersey
```

The server need by definition to have a database connection in order to store the conditions data. The database connections are defined in the file `./src/main/resources/application.yml`. This file present different set of properties which are chosen by selecting a specific spring profile when running the server. The file should be edited if you are administering the conditions database in order to provide an appropriate set of parameters.

If you do not have any remote database available you should use the default spring profile

We provide the following commands as examples:
```
$ gradle bootRun "-Dspring.profiles.active=prod" "-Dcrest.db.password=xxx"
```
or
```
$java -Dspring.profiles.active=prod -Dcrest.db.password=xxx -jar ./build/libs/crest.war
```

## Docker
You can build a container using
```
docker build -t atlgradledbmon:1.0 .
```
You can run the container using
```
docker run --env-file .environment -p 8080:8080 -d atlgradledbmon:1.0
```
or
```
docker run --env-file .environment -p 8080:8080  --net=host -d atlgradledbmon:1.0
```

A special note about the file `.environment` . You need to have this file to set variables which are used at the startup of the server. Some of the variables are already provided in the version in git, but other are not. For example, to access Oracle at CERN (for the moment only integration cluster contains a crest schema) you need to have the variable `crest.db.password=xxxxx` correctly set for a writer account. 
If you use `spring.profiles.active=default` you will have an h2 database created in `jdbc:h2:/tmp/cresth2;DB_CLOSE_ON_EXIT=FALSE`.

## Openshift
We gather here some notes on openshift deployment via gitlab-ci. These notes are for usage inside CERN.

We experienced problems when GitLab project is not public. The proposed workaround from Alberto Rodriguez Peon (INC1601495) is the following:

"By default mac stores the docker credentials in the keychain instead of .docker/config.json. (for more info see: https://docs.docker.com/engine/reference/commandline/login/#credentials-store)
However, Openshift would require the original file with the inline auth. In Mac, you could temporarily disable this behaviour by unticking "Securely store docker logins in macOS keychain" in the Docker settings. Remember to enable the option later as it is definitely more secure to use the keychain than .docker/config.json."


Remove old credentials
```
$ rm -f ~/.docker/config.json
```

Also remove old secret that has an incorrect value:
```
$ oc delete secret gitlab-token
```
and then follow the steps mentioned before
```
$ docker login gitlab.cern.ch -u test -p $TOKEN
$ docker login gitlab-registry.cern.ch -u test -p $TOKEN
```
At this point, verify that the file .docker/config.json as an inline auth. Should look like:

```
{
"auths": {
"gitlab-registry.cern.ch": {
"auth": "{long sequence of numbers and letters}=="
},
},
"HttpHeaders": {
"User-Agent": "Docker-Client/17.12.0-ce (darwin)"
}
}
```

Create the secret using the config.json file. Make sure there are no credentials for other registries!
```
$ oc create secret generic gitlab-token --from-file=.dockerconfigjson=.docker/config.json --type=kubernetes.io/dockerconfigjson
$ oc secrets link default gitlab-token --for=pull
```

### Constraints
For the moment in order for the deployment to work we need to have a public access to the gitlab project.
### Problems
