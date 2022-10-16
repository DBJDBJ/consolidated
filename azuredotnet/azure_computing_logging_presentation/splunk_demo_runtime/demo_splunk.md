
## **Splunk Setup and Demo** 

<!-- I will call them on monday and ask them, but I am pretty certain host nodes have to be linux machines. -->

<!-- Please start from here for details: https://github.com/splunk/docker-splunk/blob/master/docs/SUPPORT.md -->

There are two distinctive product categories.

1. Splunk in a Container
   - for Docker
   - for Kubernetes 
2. Splunk on the host OS
  - For Windows
  - For Linux 

CLasifiying solutions that are "Splunk in a Container" is a moot point as Kubernetes is deprecating Docker runtime, starting 2002 April. Thus any solution using any Docker API will not work on Kubernetes, after 2023 April. 

## **Splunk for Windows** 

> Splunk US, IT support, 24x7: 001 855 775 8657
<!-- Lozink@5 -->
> user: dbjdbj (pwd is made when setting up the accnt on-line)
<!-- *** -->
> email: dusan.jovanovic@fisglobal.com

Difference Windows vs Linux product

Vs Container splunk, web front seems the same but "Splunk for Windows" seems as different software behind, vs "Splunk in a Container", that is Linux. Also perhaps one or two releases behind. There are also pleaces where Windows Domain Account is required (Remote Event Log collection).

For example there are [additional processes for Splunk Enterprise on Windows](https://docs.splunk.com/Documentation/Splunk/8.2.5/Installation/Splunksarchitectureandwhatgetsinstalled). That is eight (8) additional processes supporting Splunk for Windows. Also there are subtle differences in the front end.

Splunk for Windows is a web server behind [http://127.0.0.1:8001](http://127.0.0.1:8001/en-US/account/login?return_to=%2Fen-US%2F) (no TLS)

Also, for Windows one has to choose [the Windows user with elevated rights](http://docs.splunk.com/Documentation/Splunk/8.2.5/Installation/ChoosetheuserSplunkshouldrunas)  for Splunk Windows Enterprise. That is an additional operational requirement.

<!-- https://docs.splunk.com/Documentation/Splunk/latest/Installation/Systemrequirements#Containerized_computing_platforms -->

NOTE: It seems Splunk is in (unofficial) partnership with Red Hat. For example [Ansible scripts](https://github.com/splunk/splunk-ansible#readme) are used extensively. There is also this:

> ⚠️ [DEPRECATION NOTICE](https://github.com/splunk/docker-splunk)
We are no longer releasing Debian images on Docker Hub as of May 2021 (Splunk Enterprise v8.2.0+). Red Hat images will continue to be published.

That is probably significant, as even the whole Debian Linux branch is deprecated. Splunk is a corporate player so it is understandable they are working wiht Red Hat, the other coporate player.

## Docker Container to Windows; Splunk Demo

**Splunk for Windows and HEC**

First Install the Splunk for Windows. Log in and create HTTP Event Collector; name: 'optimus', port: 8088, TLS: off.
Copy Token Value generated (for example): `6269b665-ba46-4dfd-9f92-6ec62dc650a0`

To visualise the incoming data, login to Splunk for Windows and go to New Search: 

http://127.0.0.1:8001/en-US/app/launcher/search?q=search%20source%3D"http%3Aoptimus"&earliest=0&latest=&sid=1649061406.58&display.page.search.mode=smart&dispatch.sample_ratio=1&workload_pool=

Type the filter: `source="http:optimus"`

Change the mode (upper rirght corner on the screen) to the "Fast Mode". Logs will apear:

![](media_splunk/hec_hello_world.png)

HTTP Event Collector stores its configuration in the directory (%SPLUNK_HOME%\etc\apps\splunk_httpinput\ on Windows) so that its configuration can be easily deployed using built-in app deployment capabilities.

### Containerized Splunk Enterprise

is it seems, officialy **not** supported on windows hosts. It will run, but that installation is not supported by splunk tech support. 

> The key question is if it is working on the Windows host machines Docker installation. Currently (2022Q1) is seems the answer is **no**.

**Confirmation is a moot point**

There is no much clear answers on [Splunk Answers pages](https://community.splunk.com/t5/Getting-Data-In/splunk-with-Docker-in-windows/m-p/441041/highlight/false#M76882).

[Docker Splunk readme](https://github.com/splunk/docker-splunk#readme) is short and usefull read.

Please see https://www.splunk.com/pdfs/technical-briefs/splunk-validated-architectures.pdf, for important info on supported architecture. 

![](media_splunk/splunk_single_server_deployment.png)

The only officialy supportd Splunk Deployment Architecture. In case of a Container setup all the parts are inside.

### Demo Splunk log driver for Docker

Testing "stand alone" on a FIS laptop, from Docker Desktop. Target is Splunk for Windows classic installation.

Setup and run the nginx continer that uses the splunk Docker log driver, targeting the same HEC (Http Event Collector) as made above.

> NOTE! Must use http://host.docker.internal as docker default network is BRIDGE, thus Docker does internal NAT !
> That IP bellow is used from inside Docker to target Splunk external to Docker.

```
@set "splunkhecurl=http://host.docker.internal:8088"
@set "nginx_name=optimus_nginx"
@set "splunktoken=6269b665-ba46-4dfd-9f92-6ec62dc650a0"

docker container run -p 8888:80 
--log-driver=splunk 
--log-opt splunk-url="%splunkhecurl%" 
--log-opt splunk-token="%splunktoken%" 
--log-opt splunk-insecureskipverify=true 
--name %nginx_name% nginx 
```
For **important**  splunk dev team originated info on splunk docker log driver please [see here](https://www.splunk.com/en_us/blog/tips-and-tricks/docker-1-13-with-improved-splunk-logging-driver.html).

![](media_splunk/from_alpine_to_hec_to_splunk.png)

NGINX container logs being transferred over a splunk log driver to the Windows Splunk Enterprise running on the same machine.

### Splunk plugin for Docker

https://github.com/splunk/docker-logging-plugin

A plugin is a process running on the same or a different host as the docker. 

Plugins have human-readable names, which are short, lowercase strings. Plugins can run inside or outside containers. Currently running them outside containers is recommended.

Requests flow from the Docker daemon to the plugin. So the plugin needs to implement an HTTP server.

### Splunk Kubernetes operator 

This is preffered way for deploying Splunk Enterprise Distributed Topologies. Primary scenario are production envrionments.

**Minimum Reference Hardware**

["Getting Started"](https://splunk.github.io/splunk-operator/) documentation.

[Minimum Reference Hardware](https://splunk.github.io/splunk-operator/#minimum-reference-hardware)

| Standalone	| Search Head / Search Head Cluster	| Indexer Cluster
|---------------|-----------------------------------|----------------
Each Standalone Pod: 12 Physical CPU Cores or 24 vCPU at 2Ghz or greater per core, 12GB RAM.	| Each Search Head Pod: 16 Physical CPU Cores or 32 vCPU at 2Ghz or greater per core, 12GB RAM.|	Each Indexer Pod: 12 Physical CPU cores, or 24 vCPU at 2GHz or greater per core, 12GB RAM.

**Application**

The Splunk Operator for Kubernetes is a supported method for deploying distributed Splunk Enterprise environments using containers. In production environments.

- [Known Issues for the Splunk Operator](https://splunk.github.io/splunk-operator/#known-issues-for-the-splunk-operator)
- [Prerequisites for the Splunk Operator](https://splunk.github.io/splunk-operator/#prerequisites-for-the-splunk-operator)
- [Installing the Splunk Operator](https://splunk.github.io/splunk-operator/#installing-the-splunk-operator)
- [Creating Splunk Enterprise Deployments](https://splunk.github.io/splunk-operator/#creating-splunk-enterprise-deployments)

Github repository is here: ["Splunk Operator for Kubernetes"](https://github.com/splunk/splunk-operator/blob/master/docs/README.md)

V.s. log driver that is pushing dat towards the Splunk instance, [Kubernetes operator](https://www.aquasec.com/cloud-native-academy/kubernetes-101/kubernetes-operators/) (kind of Kubernetes extension) is pulling data from the containers (on its node) and then forwarding it towards designated splunk end point IP.

