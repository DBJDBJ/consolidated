# From Containers to the Syslog
<!-- Compiler: dusan.jovanovic@fisglobal.com 
[inspiration](https://www.cloudsavvyit.com/14114/how-to-connect-to-localhost-within-a-docker-container/)
-->
There are basically two options when using syslog from a container. 

1. Pass syslog message over a network
1. Pass syslog messages over container logs


"The Easy Option", is to target the default syslog server `localhost:514` on the host machine.

Docker Desktop (18.03+) for Windows (and Mac) supports `host.docker.internal` as a functioning alias for `localhost`. Use this string inside your containers to access your host machine. (TODO: how is this working on a Linux Host + Docker?)

1. localhost and 127.0.0.1 – Resolves to the container
2. host.docker.internal – Resolves to the outside host

For the details please see the ["How To" document](howto.pdf).