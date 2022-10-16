
## 2022 03 23 Kibana log (GLobal Protect switched off)

```
[2022-03-23T12:16:02.641+00:00][WARN ][plugins.reporting.config] Found 'server.host: "0.0.0.0"' in Kibana configuration. Reporting is not able to use this as the Kibana server hostname. To enable PNG/PDF Reporting to work, 'xpack.reporting.kibanaServer.hostname: localhost' is automatically set in the configuration. You can prevent this message by adding 'xpack.reporting.kibanaServer.hostname: localhost' in kibana.yml.

[2022-03-23T12:16:02.649+00:00][WARN ][plugins.encryptedSavedObjects] Saved objects encryption key is not set. This will severely limit Kibana functionality. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.

[2022-03-23T12:16:02.660+00:00][WARN ][plugins.actions] APIs are disabled because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.

[2022-03-23T12:16:02.672+00:00][WARN ][plugins.alerting] APIs are disabled because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.

[2022-03-23T12:16:02.688+00:00][INFO ][plugins.ruleRegistry] Installing common resources shared between all indices

[2022-03-23T12:16:03.123+00:00][INFO ][plugins.screenshotting.config] Chromium sandbox provides an additional layer of protection, and is supported for Linux Ubuntu 20.04 OS. Automatically enabling Chromium sandbox.

[2022-03-23T12:16:03.607+00:00][ERROR][elasticsearch-service] Unable to retrieve version information from Elasticsearch nodes. connect ECONNREFUSED 172.20.0.3:9200

[2022-03-23T12:16:05.276+00:00][INFO ][plugins.screenshotting.chromium] Browser executable: /usr/share/kibana/x-pack/plugins/screenshotting/chromium/headless_shell-linux_x64/headless_shell
```