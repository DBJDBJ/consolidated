@setlocal

:: Instal and setup splunk and then nginx using a splunk log driver, in a docker environment

@cls

@if [%1] == [SPLUNK] goto SPLUNK_INSTALL
@if [%1] == [NGINX] goto NGINX_INSTALL
@if [%1] == [ALPINE] goto ALPINE_INSTALL

@echo.
@echo to install splunk: %0 SPLUNK
@echo to install nginx logging to splunk: %0 NGINX
@echo to install alpine logging to splunk: %0 ALPINE
@echo.
goto FINAL_EXIT

goto DONE

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:SPLUNK_INSTALL

@echo.
@echo WARNING! splunk container is not officialy supported on Windows.
@echo But it seems to work.
@echo.

:: The splunk logging driver sends container logs to HTTP Event Collector in Splunk Enterprise and Splunk Cloud.
:: Make sure to read and follow this
:: https://docs.splunk.com/Documentation/Splunk/8.2.5/Data/UsetheHTTPEventCollector#Configure_HTTP_Event_Collector_on_Splunk_Enterprise

:: https://medium.com/@caysever/docker-splunk-logging-driver-c70dd78ad56a
::  after seting up the HTTP event collector (HEC)
:: going here is where you start setup seeing that 
::  http://127.0.0.1:8989/en-US/app/search/field_extractor

:: when in splunk start from here
:: http://127.0.0.1:8989/en-US/app/splunk_monitoring_console/monitoringconsole_landing

::
:: ovde je osnovni host monitoring
:: http://127.0.0.1:8989/en-US/app/splunk_monitoring_console/monitoringconsole_overview
::
:: ovde je osnovni pogled na i setup servera aka instance
:: http://127.0.0.1:8989/en-US/app/splunk_monitoring_console/monitoringconsole_configure


:: ovde se vidi HTTP Event Collector koji smo napravili
:: http://127.0.0.1:8989/en-US/manager/search/http-eventcollector
:: prateci link gore dolazimo do ovog tokena

:: ovde je machine monitoring
:: http://127.0.0.1:8989/en-US/app/splunk_monitoring_console/resource_usage_machine?form.time.earliest=-4h%40m&form.time.latest=now&form.funcLoadAvg=Median&form.funcCPU=Median&form.funcMem=Median&form.funcDisk=Median&form.io_overlay=avg_wait_ms&form.io_perf_metric=avg_wait_ms&form.machine=bc7cbbd50dde&form.hostDiskUsageHistorical=bc7cbbd50dde&form.instanceDiskUsageSnapshot=bc7cbbd50dde&form.mount_point=%2Fopt%2Fsplunk%2Fvar&form.io_mount_point=%2Fopt%2Fsplunk%2Fvar

:: This MUST be given to nginx container creation
:: it MUST come from here: https://docs.splunk.com/Documentation/Splunk/8.2.5/Data/UsetheHTTPEventCollector#Configure_HTTP_Event_Collector_on_Splunk_Enterprise 
:: you install splunk entrprise ONCE and copy paste this token in here
:: each splunk container removal will require creating and obtaining this token from scratch
@call splunktoken.cmd

:: no TLS
@set "splunk_base_url=http://127.0.0.1/"
:: default for splunk is 8000
:: it seems fis laptop setup does not like that, try?
:: Error response from docker daemon: 
:: Ports are not available: listen tcp 0.0.0.0:8000: bind: An attempt was made to access a socket in a way forbidden by its access permissions
@set "splunk_port=10001"
@set "splunk_hec_port=10088"
@set "splunk_syslog_port=10514"
:: this is found by docker container inspect on the splunk container
:: set "splunkurl=http://172.17.0.2:8989"
::

:: this is host machine wifi ip obtained from ipconfig
:: in case of a problem put your wifi ipv4 here
:: example: @set "splunkurl=http://192.168.0.26:8989"
:: upon installation docker puts in hosts file 
:: # Added by Docker Desktop
:: 10.28.64.51 host.docker.internal 
:: thus it is obviously not advisable to use that alias
@set "splunkurl=%splunk_base_url%%splunk_port%"
@set "splunk_hec_url=%splunk_base_url%%splunk_hec_port%"

:: for splunk container setup
:: user name is always admin! password is invented here
@set "splunkpwd=P@ssword1"
@set "splunk_name=optimus_splunk"

@set "splunk_start_arg1=SPLUNK_START_ARGS=--accept-license"
@set "splunk_start_arg2=SPLUNK_PASSWORD=%splunkpwd%"

:: 
docker container stop %splunk_name%
@REM @echo will sleep 5 seconds
@REM @ping -n 6 127.0.0.1>nul
@docker container rm -f %splunk_name%

:: https://github.com/splunk/docker-splunk/issues/339
docker container run -d -e %splunk_start_arg1% -e %splunk_start_arg2% -p "%splunk_port%:8000" -p "%splunk_syslog_port%:%splunk_syslog_port%" --name %splunk_name% splunk/splunk

:: Enable syslog on udp and tcp
docker exec %splunk_name% sudo -u splunk /opt/splunk/bin/splunk add udp 10514 -sourcetype syslog -resolvehost true -auth "admin:%splunkpwd%"
docker exec %splunk_name% sudo -u splunk /opt/splunk/bin/splunk add tcp 10514 -sourcetype syslog -resolvehost true -auth "admin:%splunkpwd%"

@goto DONE

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Be sure to read this https://www.splunk.com/en_us/blog/tips-and-tricks/docker-1-13-with-improved-splunk-logging-driver.html
:NGINX_INSTALL

:: NOTE: be sure is it http or https
@set "splunkhecurl=http://host.docker.internal:8088"
:: NGINX container setup
@set "nginx_name=optimus_nginx"

@set "splunkverifyconnection=splunk-verify-connection=true"
:: 
docker container stop %nginx_name%
:: sleep 10 seconds
@REM ping -n 11 127.0.0.1>nul
docker container rm -f %nginx_name%

@call splunktoken.cmd

:: NOTE! Must use http://host.docker.internal as docker default network is BRIDGE
:: thus Docker does internal NAT !
docker container run -d -p 8888:80 --log-driver=splunk --log-opt splunk-url="%splunkhecurl%" --log-opt splunk-token="%splunktoken%" --log-opt %splunkverifyconnection% --log-opt splunk-insecureskipverify=true --name %nginx_name% nginx 

@goto DONE

:ALPINE_INSTALL


:: NOTE: be sure is it http or https
@set "splunkhecurl=http://host.docker.internal:8088"
:: NGINX container setup
@set "alpine_name=optimus_alpine"

@set "splunkverifyconnection=splunk-verify-connection=true"
:: 
docker container stop %alpine_name%
:: sleep 10 seconds
@REM ping -n 11 127.0.0.1>nul
docker container rm -f %alpine_name%

@call splunktoken.cmd

:: NOTE! Must use http://host.docker.internal as docker default network is BRIDGE
:: thus Docker does internal NAT !
docker container run -itd --log-driver=splunk --log-opt splunk-url="%splunkhecurl%" --log-opt splunk-token="6269b665-ba46-4dfd-9f92-6ec62dc650a0" --log-opt %splunkverifyconnection% --log-opt splunk-insecureskipverify=true --name %alpine_name% alpine ash

@goto DONE

:DONE
@COLOR
@if [%1] == [SPLUNK] (
    @echo.
    @echo SPLUNK container installed at %splunkurl%
    @echo SPLUNK syslog URL is: splunk_syslog_port
    @echo user name is 'admin' and password is %splunkpwd%
    @echo.
    @echo please read and follow HOWTO Enable HTTP Event Collector on Splunk Enterprise
    @echo https://docs.splunk.com/Documentation/Splunk/8.2.5/Data/UsetheHTTPEventCollector#Configure_HTTP_Event_Collector_on_Splunk_Enterprise
    @echo then paste in here the token you have generated
    @echo also please make sure in docker desktop setup, there is no any log driver set
    @echo.
)
@if [%1] == [NGINX]  (
    @echo.
    @echo NGINX container installed 
    @echo.
)
@echo.
@echo %0 Done!
@echo.

:FINAL_EXIT
@COLOR 0A
@endlocal
