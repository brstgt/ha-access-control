import 'dotenv/config'
import { cleanEnv, host, port, str } from 'envalid'

export default cleanEnv(
    // eslint-disable-next-line no-process-env
    process.env,
    {
        API_HOST: host({ default: '0.0.0.0' }),
        API_PORT: port({ default: 5051 }),
        LOG_LEVEL: str(),
        MQTT_USERNAME: str(),
        MQTT_PASSWORD: str(),
        MQTT_PORT: port({ default: 1883 }),
        MQTT_HOST: str(),
        EVENT_TOPIC: str({ default: 'access_control/events/' }),
        IMAGE_TOPIC: str({ default: 'access_control/image/' }),
        ATTEMPT_TOPIC: str({ default: 'access_control/attempt/' }),
        AVAILABILITY_TOPIC: str({ default: 'access_control/availability/' }),
    },
)
