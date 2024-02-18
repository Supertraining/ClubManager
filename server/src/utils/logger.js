import winston, { format } from 'winston';
import chalk from 'chalk';
import { CustomError } from './customError.Utils.js'

const { combine, prettyPrint, timestamp, errors } = winston.format;

const LEVEL = Symbol.for('level');
function filterOnly(level) {

	return format(function (info) {

		if (info[ LEVEL ] === level) {

			return info;

		}

	})();
}



export class Logger {

	static errorLogger = async (err, additionalInfo) => {

		try {

			if (!additionalInfo) {
				this.level().error(err.stack);

				return;
			}

			const errorMessage = `Error occurred: ${err.message}\nAdditional Info:\n
			Route: ${additionalInfo.route} 
			Method: ${additionalInfo.method}
			IP: ${additionalInfo.ip}
			User_agent: ${additionalInfo.user_agent}
			user: ${additionalInfo.user?.username}
			Stack Trace: ${err.stack}\n\n`;

			this.level().error(errorMessage)

			console.error(chalk.red.bold('Error occurred, check error.log file for more details'));

		} catch (error) {

		throw	CustomError.internalError();

		}

	};

	static level = () => {
		const logger = winston.createLogger(

			{
				format: combine(errors({ stack: true }), timestamp(), prettyPrint()),
				transports: [
					new winston.transports.Console({ level: 'info', format: filterOnly('info') }),
					new winston.transports.File({ level: 'warn', format: filterOnly('warn'), filename: './src/log/warn.log' }),
					new winston.transports.File({ level: 'error', format: filterOnly('error'), filename: './src/log/error.log', }),
				],

			}

		);
		return logger;
	}
}


