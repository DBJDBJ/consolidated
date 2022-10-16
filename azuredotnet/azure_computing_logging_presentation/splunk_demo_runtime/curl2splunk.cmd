@setlocal
@cls
:: HEC has unique name and unique token
:: token is used to connect and send and name is used to search and visualise
:: @call splunktoken.cmd
set "splunktoken=6269b665-ba46-4dfd-9f92-6ec62dc650a0"

set "splunkurl=http://127.0.0.1:8088/services/collector/event"

:: must be setup online with pwd
set "splunkuser=admin"

:: value for -d arg
:: NOTE! use only double qutoes and escape all of them inside
set "splunkarg="{\"event\" : \"Optimus Prime Tech is ready in position Alpha Beta Gama Delta\"}"

curl %splunkurl% -H "Authorization: Splunk %splunktoken%" -d %splunkarg%

@endlocal