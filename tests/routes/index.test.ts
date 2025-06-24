import server from '../../src/server'
import { describe, test, expect } from 'vitest'

describe('GET /register', () => {
    test('Should return 400 if timeout is missing', async () => {
        const response = await server.inject({
            method: 'POST',
            path: '/register',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
        expect(response.statusCode).eq(500)
        expect(response.json().error).deep.eq('Internal Server Error')
    })
    test('Should return OK', async () => {
        const response = await server.inject({
            method: 'POST',
            path: '/register',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                device_id: 'asd',
                product_key: 'asd',
                time: 'some time',
            }),
        })
        expect(response.statusCode).eq(200)
    })
})
