import 'dotenv/config'
import { bool, cleanEnv, host, num, port, str } from 'envalid'

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
        PASS_DEBOUNCE: num({
            default: 5000,
            desc: 'Skip door opening messages if last open was less then milliseconds ago',
        }),
        PASS_MAX_DELAY: num({
            default: 10000,
            desc: 'Skip door opening messages if message is older than milliseconds',
        }),
        EVENT_TOPIC: str({ default: 'access_control/events/' }),
        IMAGE_TOPIC: str({ default: 'access_control/image/' }),
        ATTEMPT_TOPIC: str({ default: 'access_control/attempt/' }),
        AVAILABILITY_TOPIC: str({ default: 'access_control/availability/' }),
        PING_TOPIC: str({ default: '' }),
        DRY_RUN: bool({ default: false, desc: 'Disable MQTT publishing' }),
    },
)
