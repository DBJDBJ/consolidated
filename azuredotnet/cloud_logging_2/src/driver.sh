#!/bin/sh 
#
# somelegacyapp is made to runn for 
# approx 15 seconds
#
# build it with: gcc somelegacyapp.c -o somelegacyapp
#
# this script will start the somelegacyapp app and
# redirect all of its standard streams to /dev/console
# and it will also run as daemon
#
# make sure of: chmod 755 on this script 
#
./somelegacyapp &>/dev/console &