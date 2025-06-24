# Integrate AI520 Asia Teco device into Home Assistant

In order to integrate it, run the server e.g. via `pnpm dev` and add your server URL
into the 


## Environment variables

`LOG_LEVEL` trace | debug | info | warn | error | fatal
`API_HOST` Listening address, default = 0.0.0.0
`API_PORT` Listening port, default = 5050
`MQTT_USERNAME` MQTT Username
`MQTT_PASSWORD` MQTT Password
`MQTT_PORT` MQTT Port, default = 1883
`MQTT_HOST` MQTT Hostname
`EVENT_TOPIC` Topic prefix to receive events from AI520 device
`IMAGE_TOPIC` Topic prefix to send images to
`ATTEMPT_TOPIC` Topic prefix to send access attempts to
`AVAILABILITY_TOPIC` Topic prefix to send device availability to