import config from './config.js'
import Fastify from 'fastify'
import mqtt from 'mqtt'
import logger from './logger.js'
import { reqisterSchema } from './schema.js'
import { getTopicForDevice } from './util'
import { handleMessage } from './messagehandler'

const server = Fastify({
    logger: {
        level: config.LOG_LEVEL,
    },
    disableRequestLogging: true,
})

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
    logger.info(`Connected to MQTT server`)
    client.subscribe(config.EVENT_TOPIC + '#', (err) => {
        if (err) {
            logger.error(err)
        } else {
            logger.info(`Subscribed to ${config.EVENT_TOPIC}`)
        }
    })
})

client.on('error', (error) => {
    logger.error(error)
})

client.on('message', (topic, message) => {
    handleMessage(client, topic, message.toString())
})
await server.ready()

export default server
