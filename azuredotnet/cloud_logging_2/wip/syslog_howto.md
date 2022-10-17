
# From Container to Syslog 
## On Windows host FIS laptop
### How to use and test this image

**Development machine run time requirements**

- Windows 10 pro with
  - WSL2 
  - Docker Windows Desktop
- Visual Syslog

## To syslog over Docker container logs

Set-up

- open docker desktop gui and goto settings,docker engine
- to the docker configuration file add
- IMPORTANT: Docker config file is processed by docker in its internal context
  - thus using `localhost` instead of `host.docker.internal` will not target the host machine but the internal docker virtual network. Thus that will quietly fail to use the external syslog server or relay.
```
  "log-driver": "syslog",
  "log-opts": {
    "syslog-address": "tcp://host.docker.internal:514",
    "syslog-facility": "user",
    "tag": "{{.ImageName}}/{{.Name}}/{{.ID}}"
  }
```
  - click on the "Apply and restart"
- start the "VisualSyslog"

### Running

Open the cmd or PowerShell

1. `docker image pull dbjdbj/dbjsyslog`
   1. [Docker pull](https://docs.docker.com/engine/reference/commandline/pull/)
2. `docker container run -d --name <your name> dbjdbj/dbjsyslog`
   1. [Docker container run](https://docs.docker.com/engine/reference/commandline/container_run/)
3. `docker container exec -it <your name> ash`
   1. Now you are inside the container in the Alpine shell aka "ash"
   2. Look into the folder `./dbj` for various tests.

## Conclusion



### Further

Above work is based on very light Alpine linux; distro very slightly upgraded.

For further Docker Container network related research please [review this article](https://www.cloudsavvyit.com/14114/how-to-connect-to-localhost-within-a-docker-container/).