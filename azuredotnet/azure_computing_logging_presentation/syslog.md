
## Syslog 

![](media3/syslog_logging_arch.png)

[Syslog](https://en.wikipedia.org/wiki/Syslog) is logging standard and logging infrastructure protocol.

## Architecture and Features

![](media2/syslog_architecture.png)

That are the three components of the syslog infrastructure. Overlaid with the Containers concept. Some standard valid toplogies (from RFC3164):

```
+------+         +---------+
|Device|---->----|Collector|
+------+         +---------+

+------+         +-----+         +---------+
|Device|---->----|Relay|---->----|Collector|
+------+         +-----+         +---------+

+------+     +-----+            +-----+     +---------+
|Device|-->--|Relay|-->--..-->--|Relay|-->--|Collector|
+------+     +-----+            +-----+     +---------+

+------+         +-----+         +---------+
|Device|---->----|Relay|---->----|Collector|
|      |-\       +-----+         +---------+
+------+  \
           \      +-----+         +---------+
            \-->--|Relay|---->----|Collector|
                  +-----+         +---------+

+------+         +---------+
|Device|---->----|Collector|
|      |-\       +---------+
+------+  \
           \      +-----+         +---------+
            \-->--|Relay|---->----|Collector|
                  +-----+         +---------+

+------+         +-----+            +---------+
|Device|---->----|Relay|---->-------|Collector|
|      |-\       +-----+         /--|         |
+------+  \                     /   +---------+
           \      +-----+      /
            \-->--|Relay|-->--/
                  +-----+
```
Initialy Syslog was invented for logging from network devices.  These days it is used for "everything".

Syslog has started in 1980's. Circa 2022 there is basically two syslog ecosystems:

- [syslog-ng](https://en.wikipedia.org/wiki/Syslog-ng)
- [rsyslog](https://en.wikipedia.org/wiki/Rsyslog)

### Syslog Forwarding 

As already shown is log transport tool used to forward system, command, and event logs to an external monitoring system. 

There are [a lot of Docker images](https://pkgs.alpinelinux.org/packages?name=*syslog*) used to implement log forwarding to various major logging aggregators.

### The Benefits

- syslog should work on either AKS or EKS without any special AKS/EKS requirements to be satisfied
- it is a standard gateway to/from any logging system of choice
- All major Logging software vendors offer syslog conection, delaying and aggregation
- That is a major win decoupling from logging infrastructure and thus allowing for different customers using different logging solutions

### The issues

The fact that Syslog is UDP-based means there can be issues with reliability. On the other hand, as systems become more complex, it becomes increasingly important to collect and monitor all relevant data produced by applications.



