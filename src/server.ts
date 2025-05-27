import routes from './routes/index.js'
import config from './config.js'
import Fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

const server = Fastify({
    logger: {
        level: config.LOG_LEVEL,
    },
    disableRequestLogging: true,
}).withTypeProvider<TypeBoxTypeProvider>()

server.register(routes)
await server.ready()

export default server
