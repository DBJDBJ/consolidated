# Install Kibana with Docker

<!-- https://www.elastic.co/guide/en/kibana/8.1/docker.html#docker -->

Docker images for Kibana are available from the Elastic Docker registry. The base image is ubuntu:20.04.

A list of all published Docker images and tags is available at [www.docker.elastic.co](https://www.docker.elastic.co/). The source code is in [GitHub](https://github.com/elastic/dockerfiles/tree/8.1/kibana).

These images contain both free and subscription features. Start a [30-day trial](https://www.elastic.co/guide/en/kibana/8.1/managing-licenses.html) to try out all of the features.

# Run Kibana on Docker for development

1. Start an Elasticsearch container for development or testing:
```
docker network create elastic
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.1.0
docker run --name es-node01 --net elastic -p 9200:9200 -p 9300:9300 -t docker.elastic.co/elasticsearch/elasticsearch:8.1.0
```
When you start Elasticsearch for the first time, the following security configuration occurs automatically:

- Certificates and keys are generated for the transport and HTTP layers.
- The Transport Layer Security (TLS) configuration settings are written to elasticsearch.yml.
- A password is generated for the elastic user.
- An enrollment token is generated for Kibana.

You might need to scroll back a bit in the terminal to view the password and enrollment token.

2. Copy the generated password and enrollment token and save them in a secure location. These values are shown only when you start Elasticsearch for the first time. You’ll use these to enroll Kibana with your Elasticsearch cluster and log in.
3. In a new terminal session, start Kibana and connect it to your Elasticsearch container:
```
docker pull docker.elastic.co/kibana/kibana:8.1.0
docker run --name kib-01 --net elastic -p 5601:5601 docker.elastic.co/kibana/kibana:8.1.0
```
When you start Kibana, a unique link is output to your terminal.

4. To access Kibana, click the generated link in your terminal.

- In your browser, paste the enrollment token that you copied when starting Elasticsearch and click the button to connect your Kibana instance with Elasticsearch.

- Log in to Kibana as the **elastic** user with the password that was generated when you started Elasticsearch.

## Generate passwords and enrollment tokens

If you need to reset the password for the **elastic** user or other built-in users, run the elasticsearch-reset-password tool. This tool is available in the Elasticsearch bin directory of the Docker container.

For example, to reset the password for the elastic user:
```
docker exec -it es-node01 /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic
```
If you need to generate new enrollment tokens for Kibana or Elasticsearch nodes, run the [elasticsearch-create-enrollment-token](https://www.elastic.co/guide/en/elasticsearch/reference/8.1/create-enrollment-token.html) tool. This tool is available in the Elasticsearch bin directory of the Docker container.

For example, to generate a new enrollment token for Kibana:
```
docker exec -it es-node01 /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana
```
## Remove Docker containers
To remove the containers and their network, run:
```
docker network rm elastic
docker rm es-node01
docker rm kib-01
```
# Configure Kibana on Docker
The Docker images provide several methods for configuring Kibana. The conventional approach is to provide a kibana.yml file as described in Configuring Kibana, but it’s also possible to use environment variables to define settings.

## Bind-mounted configuration
One way to configure Kibana on Docker is to provide kibana.yml via bind-mounting. With docker-compose, the bind-mount can be specified like this:
```
version: '2'
services:
  kibana:
    image: docker.elastic.co/kibana/kibana:8.1.0
    volumes:
      - ./kibana.yml:/usr/share/kibana/config/kibana.yml
```      
## Persist the Kibana keystore
By default, Kibana auto-generates a keystore file for secure settings at startup. To persist your secure settings, use the kibana-keystore utility to bind-mount the parent directory of the keystore to the container. For example:
```
docker run -it --rm -v full_path_to/config:/usr/share/kibana/config -v full_path_to/data:/usr/share/kibana/data docker.elastic.co/kibana/kibana:8.1.0 bin/kibana-keystore create
docker run -it --rm -v full_path_to/config:/usr/share/kibana/config -v full_path_to/data:/usr/share/kibana/data docker.elastic.co/kibana/kibana:8.1.0 bin/kibana-keystore add test_keystore_setting
```
## Environment variable configuration
Under Docker, Kibana can be configured via environment variables. When the container starts, a helper process checks the environment for variables that can be mapped to Kibana command-line arguments.

For compatibility with container orchestration systems, these environment variables are written in all capitals, with underscores as word separators. The helper translates these names to valid Kibana setting names.

All information that you include in environment variables is visible through the ps command, including sensitive information.

Some example translations are shown here:

Table 1. Example Docker Environment Variables

| Environment Variable | Kibana Setting
|----------------------|---------------
| SERVER_NAME | server.name
| SERVER_BASEPATH | server.basePath
| ELASTICSEARCH_HOSTS | elasticsearch.hosts

In general, any setting listed in Configure Kibana can be configured with this technique.

Supplying array options can be tricky. The following example shows the syntax for providing an array to ELASTICSEARCH_HOSTS.

These variables can be set with docker-compose like this:
```
version: '2'
services:
  kibana:
    image: docker.elastic.co/kibana/kibana:8.1.0
    environment:
      SERVER_NAME: kibana.example.org
      ELASTICSEARCH_HOSTS: '["http://es01:9200","http://es02:9200","http://es03:9200"]'
```
Since environment variables are translated to CLI arguments, they take precedence over settings configured in kibana.yml.

## Docker defaults
The following settings have different default values when using the Docker images:

| server.host | "0.0.0.0"
| server.shutdownTimeout | "5s"
| elasticsearch.hosts | http://elasticsearch:9200
| monitoring.ui.container.elasticsearch.enabled | true

These settings are defined in the default `kibana.yml`. They can be overridden with a custom `kibana.yml` or via environment variables.

If replacing `kibana.yml` with a custom version, be sure to copy the defaults to the custom file if you want to retain them. If not, they will be "masked" by the new file.