#!/bin/sh
#
# if it does not execute, do chmod 755 on this file
#
#  make sure docker configuration is as below
# that is processed from "inside" the docker
# thus 'localhost' bellow will not work
# host.docker.internal is docker made and is
# alias to the IP of the localhost on the host machine
#
#  "log-driver": "syslog",
#  "log-opts": {
#    "syslog-address": "udp://host.docker.internal:514",
#    "syslog-facility": "user",
#    "tag": "{{.ImageName}}/{{.Name}}/{{.ID}}"
#  }
#
#
# All the syslog driver message are going out as user INFO and
# cannot be changed even if logger is used from a container.
# The way around that is to target external syslog server direct
# (flag -L is probably not required)
syslogd -L -R host.docker.internal:514
#
# one nano second resolution timestamp as a string
timestamp() {
# https://www.gnu.org/software/coreutils/manual/html_node/Time-conversion-specifiers.html#Time-conversion-specifiers    
  date +"%X" 
}
#
# Ok, now let us send direct all the priorities 0 .. 7
# using the logger command
#
logger -s -p user.0 "$(timestamp) User Emergency message"
sleep 1
logger -s -p user.1 "$(timestamp) User Alert     message"
sleep 1
logger -s -p user.2 "$(timestamp) User Critical  message"
sleep 1
logger -s -p user.3 "$(timestamp) User Error     message"
sleep 1
logger -s -p user.4 "$(timestamp) User Warning   message"
sleep 1
logger -s -p user.5 "$(timestamp) User Notice    message"
sleep 1
logger -s -p user.6 "$(timestamp) User Info      message"
sleep 1
logger -s -p user.7 "$(timestamp) User Debug     message"
#
# above is going straight out over the network and is thus not appearing in the log file
# -s outputs the full syslog message to stderr in the shell thus
# ash users will see them messages too