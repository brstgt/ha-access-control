import config from './config.js'

const deviceMap: Record<string, string> = {
    G010525CZX10609: 'garage',
}

export const getTopicForDevice = (id: string): string => {
    return deviceMap[id] ?? 'unknown'
}

export const getAvailabilityTopic = (id: string) => {
    return config.AVAILABILITY_TOPIC + getTopicForDevice(id)
}

export const getImageTopic = (id: string) => {
    return config.IMAGE_TOPIC + getTopicForDevice(id)
}

export const getAttemptTopic = (id: string) => {
    return config.ATTEMPT_TOPIC + getTopicForDevice(id)
}
