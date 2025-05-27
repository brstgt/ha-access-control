import 'dotenv/config'
import { cleanEnv, host, port, str } from 'envalid'

export default cleanEnv(
    // eslint-disable-next-line no-process-env
    process.env,
    {
        API_HOST: host({ default: '0.0.0.0' }),
        API_PORT: port({ default: 5050 }),
        LOG_LEVEL: str(),
        HOME_ASSISTANT_URL: str(),
        HOME_ASSISTANT_TOKEN: str(),
    },
)
