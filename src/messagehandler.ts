import { Heartbeat, messageSchema, Note } from './schema.js'
import { getAttemptTopic, getAvailabilityTopic, getImageTopic } from './util'
import { MqttClient } from 'mqtt'
import logger from './logger'

export const handleNote = async (client: MqttClient, msg: Note) => {
    const eventDate = new Date(msg.data.noteTime + '+0200')
    const now = new Date()
    const diff = now.getTime() - eventDate.getTime()
    if (diff > 1000) {
        logger.warn(`Event Date: ${eventDate.toISOString()}, now: ${now.toISOString()}, diff: ${diff}ms`)
    }
    client.publish(
        getAttemptTopic(msg.data.deviceId),
        JSON.stringify({
            event_type: msg.data.notePass ? 'pass' : 'fail',
            person: msg.data.employeeName,
            delay_ms: diff,
        }),
    )
    const imageData = msg.data.noteImg.split(',')[1]
    client.publish(getImageTopic(msg.data.deviceId), imageData)
}

export const handleHeartbeat = async (client: MqttClient, msg: Heartbeat) => {
    client.publish(getAvailabilityTopic(msg.deviceId), 'ON')
}

export const handleMessage = async (client: MqttClient, topic: string, message: string) => {
    logger.info(new Date().toISOString() + ` [${topic}] ${message}`)
    try {
        const msg = messageSchema.parse(JSON.parse(message))
        switch (msg.type) {
            case 'note': {
                await handleNote(client, msg)
                break
            }
            case 'heart':
                await handleHeartbeat(client, msg)
                break
        }
    } catch (error) {
        logger.error(error)
    }
}
