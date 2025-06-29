import { Heartbeat, messageSchema, Note } from './schema.js'
import { getAttemptTopic, getAvailabilityTopic, getImageTopic } from './util.js'
import { MqttClient } from 'mqtt'
import logger from './logger.js'
import config from './config.js'

const dryRun = true

let lastHeartbeat: Date | null = null
let lastPass: Date | null = null

const info = (msg: string) => {
    logger.info(new Date().toISOString() + ` ${msg}`)
}

export const handleNote = async (client: MqttClient, msg: Note) => {
    const eventDate = new Date(msg.data.noteTime + '+0200')
    const now = new Date()
    const msEventDiff = now.getTime() - eventDate.getTime()
    const msSinceLastPass = lastPass ? new Date().getTime() - lastPass.getTime() : 0
    info(`Passed: ${msg.data.notePass}, Event Date: ${eventDate.toISOString()}, Diff: ${msEventDiff}ms, Since last ${msSinceLastPass}ms`)
    if (msEventDiff > config.PASS_MAX_DELAY) {
        info(`Skip old door event ${msEventDiff}ms`)
        return
    }
    if (msg.data.notePass) {
        lastPass = new Date()
        if (msSinceLastPass > 0 && msSinceLastPass < config.PASS_DEBOUNCE) {
            info(`Debounce door open event within ${msSinceLastPass}ms`)
            return
        }
    }
    if (dryRun) {
        return
    }
    client.publish(
        getAttemptTopic(msg.data.deviceId),
        JSON.stringify({
            event_type: msg.data.notePass ? 'pass' : 'fail',
            person: msg.data.employeeName,
            delay_ms: msEventDiff,
        }),
    )
    const imageData = msg.data.noteImg.split(',')[1]
    client.publish(getImageTopic(msg.data.deviceId), imageData)
}

export const handleHeartbeat = async (client: MqttClient, msg: Heartbeat) => {
    const diff = lastHeartbeat ? new Date().getTime() - lastHeartbeat.getTime() : 0
    lastHeartbeat = new Date()
    info(`Heartbeat after ${diff}ms`)
    if (dryRun) {
        return
    }
    client.publish(getAvailabilityTopic(msg.deviceId), 'ON')
}

export const handleMessage = async (client: MqttClient, topic: string, message: string) => {
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
