import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'vending-machine-api' },
  transports: [
    process.env.NODE_ENV !== 'test'
      ? new winston.transports.Console({
          format: winston.format.colorize(),
        })
      : new winston.transports.File({ filename: 'test_logs.txt', level: 'silly' }),
  ],
})

export default logger
