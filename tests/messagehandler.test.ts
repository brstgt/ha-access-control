import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import pass from './events/pass.json' with { type: 'json' }
import fail from './events/fail.json' with { type: 'json' }
import heartbeat from './events/heartbeat.json' with { type: 'json' }
import { handleMessage } from '../src/messagehandler'
import { MqttClient } from 'mqtt'
import logger from '../src/logger.js'

describe('Messagehandler', () => {
    const client = {
        publish: vi.fn(),
    } as unknown as MqttClient
    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2025-06-29 11:07:13+0000'))
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.resetAllMocks()
    })

    test('Should handle heartbeat', async () => {
        await handleMessage(client, 'foo', JSON.stringify(heartbeat))
        expect(client.publish).toHaveBeenCalledWith('access_control/availability/garage', 'ON')
    })
    test('Should handle passed note', async () => {
        const log = vi.spyOn(logger, 'warn')
        await handleMessage(client, 'foo', JSON.stringify(pass))
        expect(client.publish).toHaveBeenNthCalledWith(
            1,
            'access_control/attempt/garage',
            JSON.stringify({
                event_type: 'pass',
                person: 'Benjamin',
                delay_ms: 279000,
            }),
        )
        expect(client.publish).toHaveBeenNthCalledWith(2, 'access_control/image/garage', 'PICTUREDATA')
        expect(log).toHaveBeenCalledTimes(1)
        expect(log).toHaveBeenCalledWith('Event Date: 2025-06-29T11:02:34.000Z, now: 2025-06-29T11:07:13.000Z, diff: 279000ms')
    })
    test('Should handle failed note', async () => {
        await handleMessage(client, 'foo', JSON.stringify(fail))
        await handleMessage(client, 'foo', JSON.stringify(pass))
        expect(client.publish).toHaveBeenNthCalledWith(
            1,
            'access_control/attempt/garage',
            JSON.stringify({
                event_type: 'fail',
                person: '',
                delay_ms: 180000,
            }),
        )
        expect(client.publish).toHaveBeenNthCalledWith(2, 'access_control/image/garage', 'PICTUREDATA')
    })
})
