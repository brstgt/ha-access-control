import server from '../../src/server'
import { describe, test, expect } from 'vitest'

describe('GET /', () => {
    test('Should return 400 if timeout is missing', async () => {
        const response = await server.inject({
            method: 'GET',
            path: '/ping/foo',
        })
        expect(response.statusCode).eq(400)
        expect(response.json().error).deep.eq('Bad Request')
    })
    test('Should return OK', async () => {
        const response = await server.inject({
            method: 'GET',
            path: '/ping/foo?timeout=3',
        })
        expect(response.statusCode).eq(200)
        expect(response.body).deep.eq('OK: foo')
    })
})
