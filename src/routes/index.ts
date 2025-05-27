import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox'
import { registerSensor } from '../sensors.js'

const routes: FastifyPluginAsyncTypebox = async (server) => {
    server.get(
        '/ping/:sensor',
        {
            schema: {
                params: Type.Object({
                    sensor: Type.String(),
                }),
                querystring: Type.Object({
                    timeout: Type.Number(),
                }),
                response: {
                    200: Type.String(),
                },
            },
        },
        async function (request) {
            const { sensor } = request.params
            await registerSensor(sensor, request.query.timeout)
            return 'OK: ' + sensor
        },
    )
}

export default routes
