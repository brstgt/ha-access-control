import console, { LogLevelNames } from 'console-log-level'
import config from './config.js'

export default console({ level: config.LOG_LEVEL as LogLevelNames })
