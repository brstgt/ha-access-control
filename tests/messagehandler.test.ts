import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import pass from './events/pass.json' with { type: 'json' }
import fail from './events/fail.json' with { type: 'json' }
import heartbeat from './events/heartbeat.json' with { type: 'json' }
import { handleMessage } from '../src/messagehandler'
import { MqttClient } from 'mqtt'
import logger from '../src/logger.js'

describe('Messagehandler', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2025-06-29 11:07:13+0000'))
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.resetAllMocks()
    })

    test('Should handle heartbeat', async () => {
        const client = {
            publish: vi.fn(),
        }
        await handleMessage(client as MqttClient, 'foo', JSON.stringify(heartbeat))
        expect(client.publish).toHaveBeenCalledWith('access_control/availability/garage', 'ON')
    })
    test('Should handle passed note', async () => {
        const client = {
            publish: vi.fn(),
        }
        const log = vi.spyOn(logger, 'warn')
        await handleMessage(client as MqttClient, 'foo', JSON.stringify(pass))
        expect(client.publish).toHaveBeenCalledTimes(2)
        expect(log).toHaveBeenCalledTimes(1)
        expect(log).toHaveBeenCalledWith('Event Date: 2025-06-29T11:02:34.000Z, now: 2025-06-29T11:07:13.000Z, diff: 279000ms')
    })
    test('Should handle failed note', async () => {
        const client = {
            publish: vi.fn(),
        }
        await handleMessage(client as MqttClient, 'foo', JSON.stringify(fail))
        expect(client.publish).toHaveBeenCalledTimes(2)
    })
})
