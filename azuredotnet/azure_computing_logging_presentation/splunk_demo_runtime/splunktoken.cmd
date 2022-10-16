::
:: This MUST be given to nginx (or any other) container creation using the splunk log driver
::
:: it MUST come from here: https://docs.splunk.com/Documentation/Splunk/8.2.5/Data/UsetheHTTPEventCollector#Configure_HTTP_Event_Collector_on_Splunk_Enterprise 
:: you install splunk entrprise ONCE and copy paste this token in here
:: each splunk container removal will require creating and obtaining this token from scratch
::
@set "splunktoken=6269b665-ba46-4dfd-9f92-6ec62dc650a0"
