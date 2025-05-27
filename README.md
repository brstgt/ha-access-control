# Presence detector for Home Assistant

It detects presence based on HTTP pings and reports them to a home assistant binary sensor.
If ping is missing, the sensor will turn to OFF after a timeout which is passed in the URL:

In order to trigger a sensor called `my_sensor` which will turn to OFF after 3s of inactivity, use:

http://localhost:5050/ping/my_sensor?timeout=3

## Environment variables

`LOG_LEVEL` trace | debug | info | warn | error | fatal
`API_HOST` Listening address, default = 0.0.0.0
`API_PORT` Listening port, default = 5050
`HOME_ASSISTANT_URL` The URL of your home assistant instance
`HOME_ASSISTANT_TOKEN` An access token for your home assistant instance