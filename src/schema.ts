import z from 'zod'

const heartbeat = z.object({
    type: z.literal('heart'),
    deviceId: z.string(),
})
const paramUpload = z.object({
    type: z.literal('param_upload'),
    data: z.object({
        deviceId: z.string(),
    }),
})
const note = z.object({
    type: z.literal('note'),
    data: z.object({
        deviceId: z.string(),
        employeeId: z.string(),
        employeeName: z.string(),
        notePass: z.number(),
        employeeIc: z.string().optional(),
        noteTime: z.string(),
        noteWay: z.number(),
        notetemptype: z.number(),
        humTemp: z.string(),
        notePity: z.number(),
        noteImgName: z.string(),
        base64_pic_len: z.number(),
        imgType: z.string(),
        noteImg: z.string(),
    }),
})
export const messageSchema = z.discriminatedUnion('type', [heartbeat, note, paramUpload])
export const reqisterSchema = z.object({
    device_id: z.string(),
    product_key: z.string(),
    time: z.string(),
})
