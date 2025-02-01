const {createLogger, format, transports, addColors} = require("winston")
const {combine, timestamp, printf, colorize, json} = format
require("winston-mongodb")
// const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config({path: ".env"})


// Windows uchun maxsus ranglar
const colors = {
  error: 'red', // qizil
  warn: 'yellow',  // sariq
  info: 'green',  // yashil
  reset: 'blue'   // rangni tiklash
}

addColors(colors);

// Maxsus format yaratamiz
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
  const metaStr = Object.keys(metadata).length ? `\n${JSON.stringify(metadata, null, 2)}` : ''

  return `[${timestamp}] [${level}] ${message} ${metaStr}`
  
})

const mongoFormat = format((info) => {
  const { level, message, timestamp, ...metadata } = info;
  return {
    level,
    message,
    timestamp,
    metadata
  };
})();

const logger = createLogger({
  transports: [
    new transports.Console({
      format:combine(
        colorize({all: true}),
        timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        consoleFormat
      ),
      level: "info",
    }),

    new transports.File({
      filename: `logs/${new Date().toISOString().split('T')[0]}-logs.json`,
      format: combine(
        timestamp(),
        json()
      ),
      level: "info",
    }),

    new transports.MongoDB({
      level: 'info',
      db: process.env.MONGO_URI || "mongodb+srv://biznesmen1124:ZUJMIZ7PKiBdCenV@cluster0.qb1fq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
      collection: 'logs',
      format: combine(
        timestamp(),
        mongoFormat,
        json()
      ),
      decolorize: true,
      // MongoDB ulanish xatoliklarini ko'rsatish
      handleExceptions: true,
      handleRejections: true,
      tryReconnect: true
    })
  ]
})

// MongoDB ulanish xatoliklarini console da ko'rsatish
logger.on('error', (error) => {
  console.error('Logger Error:', error);
});

module.exports = logger