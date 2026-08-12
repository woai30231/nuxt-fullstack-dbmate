import fs from 'node:fs'
import path from 'node:path'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const logsDir = path.resolve(process.cwd(), 'logs')

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true })
}

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        return stack
            ? `[${timestamp}] ${level}: ${message}\n${stack}`
            : `[${timestamp}] ${level}: ${message}`
    }),
)

// 按类型：error 单独文件，按天切割
const errorTransport = new DailyRotateFile({
    dirname: logsDir,
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxFiles: '14d', // 保留 14 天
    zippedArchive: false,
})

// 按类型：info（含 info/warn；不含 error 也可以，看 level 配置）
const infoTransport = new DailyRotateFile({
    dirname: logsDir,
    filename: 'info-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'info',
    maxFiles: '14d',
})

// 全部汇总（可选）
const combinedTransport = new DailyRotateFile({
    dirname: logsDir,
    filename: 'combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
})

export const logger = winston.createLogger({
    level: 'info',
    format,
    transports: [
        errorTransport,
        infoTransport,
        combinedTransport,
        // 开发时同时打到终端，方便你对照
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                format,
            ),
        }),
    ],
})