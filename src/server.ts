import config from './config.js'
import Fastify from 'fastify'
import mqtt from 'mqtt'
import logger from './logger'
import { messageSchema, reqisterSchema } from './schema'

const server = Fastify({
    logger: {
        level: config.LOG_LEVEL,
    },
    disableRequestLogging: true,
})

const deviceMap: Record<string, string> = {
    G010525CZX10609: 'garage',
}

const getTopicForDevice = (id: string): string => {
    return deviceMap[id] ?? 'unknown'
}

const getAvailabilityTopic = (id: string) => {
    return config.AVAILABILITY_TOPIC + getTopicForDevice(id)
}

const getImageTopic = (id: string) => {
    return config.IMAGE_TOPIC + getTopicForDevice(id)
}

const getAttemptTopic = (id: string) => {
    return config.ATTEMPT_TOPIC + getTopicForDevice(id)
}

server.post('/register', async (req) => {
    logger.info('Register device')
    try {
        const { device_id } = reqisterSchema.parse(req.body)
        const deviceName = getTopicForDevice(device_id)
        const responseData = {
            token: deviceName,
            client_key: deviceName,
            username: config.MQTT_USERNAME,
            password: config.MQTT_PASSWORD,
            host: 'tcp://',
            port: config.MQTT_PORT + '',
            ip: config.MQTT_HOST,
            server_client_id: device_id,
            order_topic: '$iot/msg/',
            info_topic: config.EVENT_TOPIC,
            result_device_topic: '$iot/result/events/',
            result_server_topic: '$iot/result/msg/',
        }
        const response = {
            code: 200,
            count: 0,
            data: responseData,
        }
        logger.info(response)
        return JSON.stringify(response)
    } catch (error) {
        logger.error(error)
        throw error
    }
})

const client = mqtt.connect('mqtt://' + config.MQTT_HOST + ':' + config.MQTT_PORT, {
    username: config.MQTT_USERNAME,
    password: config.MQTT_PASSWORD,
})

client.on('connect', () => {
    client.subscribe(config.EVENT_TOPIC + '#', (err) => {
        if (err) {
            logger.error(err)
        }
    })
})

client.on('message', (topic, message) => {
    const messageString = message.toString()
    logger.info(topic + ': ' + messageString)
    try {
        const msg = messageSchema.parse(JSON.parse(messageString))
        switch (msg.type) {
            case 'note': {
                client.publish(
                    getAttemptTopic(msg.data.deviceId),
                    JSON.stringify({
                        event_type: msg.data.notePass ? 'pass' : 'fail',
                        person: msg.data.employeeName,
                    }),
                )
                const imageData = msg.data.noteImg.split(',')[1]
                client.publish(getImageTopic(msg.data.deviceId), imageData)
                break
            }
            case 'heart':
                client.publish(getAvailabilityTopic(msg.deviceId), 'ON')
                break
        }
    } catch (error) {
        logger.error(error)
    }
})
await server.ready()

export default server
