import server, { shutdown } from './server.js'
import config from './config.js'
import log from './logger.js'

process.on('unhandledRejection', (err) => {
    log.error(err)
    process.exit(1)
})

const port = config.API_PORT
const host = config.API_HOST
await server.listen({ host, port })

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
        log.debug(`Received ${signal}`)
        Promise.all([shutdown()])
            .then(() => {
                log.debug(`Close application on ${signal}`)
                process.exit(0)
            })
            .catch(() => {
                log.debug(`Error closing application on ${signal}`)
                process.exit(1)
            })
    })
}
