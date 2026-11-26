import winston, { format } from "winston";

const { combine, prettyPrint, timestamp, errors } = winston.format;

const LEVEL = Symbol.for("level");
function filterOnly(level) {
  return format(function (info) {
    if (info[LEVEL] === level) {
      return info;
    }
  })();
}

export class Logger {
  static level = () => {
    const logger = winston.createLogger({
      format: combine(errors({ stack: true }), timestamp(), prettyPrint()),
      transports: [
        new winston.transports.Console({ level: "info", format: filterOnly("info") }),
        new winston.transports.File({
          level: "warn",
          format: filterOnly("warn"),
          filename: "./src/log/warn.log",
        }),
        new winston.transports.File({
          level: "error",
          format: filterOnly("error"),
          filename: "./src/log/error.log",
        }),
      ],
    });
    return logger;
  };
}
