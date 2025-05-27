import config from './config.js'
import log from './logger.js'

type Sensor = {
    state: State
    timer: NodeJS.Timeout
}
const sensors = new Map<string, Sensor>()

type State = 'on' | 'off'

export const sendStatus = async (sensor: string, state: State) => {
    try {
        const result = await fetch(`${config.HOME_ASSISTANT_URL}/api/states/binary_sensor.${sensor}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${config.HOME_ASSISTANT_TOKEN}`,
            },
            body: JSON.stringify({ state: state, attributes: { friendly_name: sensor } }),
        })
        if (result.status === 200) {
            log.debug(`Registered status ${sensor}: ${state}`)
        }
    } catch (error) {
        log.error(error)
    }
}

const setState = async (name: string, state: State) => {
    const sensor = sensors.get(name)
    if (!sensor) {
        return
    }
    sensor.state = state
    await sendStatus(name, state)
}

export const registerSensor = async (name: string, timeoutSeconds: number) => {
    const timeout = setTimeout(async () => await setState(name, 'off'), timeoutSeconds * 1000)

    const sensor = sensors.get(name)
    if (sensor) {
        clearTimeout(sensor.timer)
        sensor.timer = timeout
    } else {
        sensors.set(name, {
            timer: timeout,
            state: 'on',
        })
    }
    await setState(name, 'on')
}

export const unregisterSensors = async () => {
    for (const key of sensors.keys()) {
        const sensor = sensors.get(key)
        if (sensor) {
            clearTimeout(sensor.timer)
            if (sensor.state === 'on') {
                await sendStatus(key, 'off')
            }
        }
    }
}
